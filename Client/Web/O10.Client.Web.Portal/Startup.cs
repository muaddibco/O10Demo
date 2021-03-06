﻿using System.Threading;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using O10.Client.Web.Common.Hubs;
using O10.Client.Web.Common.Services;
using O10.Core.Configuration;
using O10.Core.ExtensionMethods;
using O10.Core.Logging;
using O10.Server.IdentityProvider.Common.Controllers;
using O10.Server.IdentityProvider.Common.Hubs;
using O10.Client.Web.Portal.Hubs;
using O10.Client.Web.Portal.IdentityServer;
using O10.Client.Web.Portal.IdentityServer.Data;
using O10.Client.Web.Portal.IdentityServer.Data.Models;
using O10.Client.Web.Portal.Services.Inherence;

namespace O10.Client.Web.Portal
{
    public class Startup
    {
        private readonly CancellationTokenSource _cancellationTokenSource;
        private readonly Log4NetLogger _logger;

        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

            Configuration = builder.Build();

            _cancellationTokenSource = new CancellationTokenSource();
            _logger = new Log4NetLogger(null);
            _logger.Initialize(nameof(Startup), "log4net.xml");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddApplicationInsightsTelemetry();
            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(
            //        Configuration.GetConnectionString("DefaultConnection")));

            //services.AddDefaultIdentity<ApplicationUser>(options =>
            //    {
            //        options.Password.RequireDigit = false;
            //        options.Password.RequiredLength = 3;
            //        options.Password.RequiredUniqueChars = 0;
            //        options.Password.RequireLowercase = false;
            //        options.Password.RequireNonAlphanumeric = false;
            //        options.Password.RequireUppercase = false;
            //    })
            //    .AddRoles<IdentityRole>()
            //    .AddEntityFrameworkStores<ApplicationDbContext>();

            //IIdentityServerBuilder identityServerBuilder =
            //    services.AddIdentityServer()
            //        .AddApiAuthorization<ApplicationUser, ApplicationDbContext>()
            //        .AddProfileService<ProfileService>();

            //services.AddAuthentication()
            //    .AddIdentityServerJwt();

            services.AddControllersWithViews().AddNewtonsoftJson();
            //services.AddRazorPages();

            services.AddCors();
            services.AddMvc()
                .AddApplicationPart(typeof(IdentityProviderController).Assembly)
                .AddControllersAsServices();

            // In production, the Angular files will be served from this directory
            //services.AddSpaStaticFiles(configuration =>
            //{
            //    configuration.RootPath = "ClientApp/dist";
            //});

            services.AddSignalR();
            //services.TryAddTransient<IClaimsService, ClaimsService>();

            services.AddBootstrapper<WebApiBootstrapper>(_logger);
            AspAppConfig aspAppConfig = new AspAppConfig(Configuration);
            services.Replace(new ServiceDescriptor(typeof(IAppConfig), _ => new AspAppConfig(Configuration), ServiceLifetime.Singleton));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app?.ApplicationServices
                .UseBootstrapper<WebApiBootstrapper>(_cancellationTokenSource.Token, _logger);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                //app.UseHsts();
            }

            //app.UseHttpsRedirection();
            //app.UseStaticFiles();

            //if (!env.IsDevelopment())
            //{
            //    app.UseSpaStaticFiles();
            //}

            app.UseRouting();

            app.UseCors(x => x
                .WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            //app.UseAuthentication();
            //app.UseIdentityServer();
            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "api/{controller}");
                //endpoints.MapRazorPages();
                //endpoints.MapControllers();

                endpoints.MapHub<IdentitiesHub>("/identitiesHub", o =>
                {
                    o.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.LongPolling | Microsoft.AspNetCore.Http.Connections.HttpTransportType.WebSockets;
                });

                endpoints.MapHub<ConsentManagementHub>("/consentHub", o =>
                {
                    o.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.LongPolling | Microsoft.AspNetCore.Http.Connections.HttpTransportType.WebSockets;
                });

                endpoints.MapHub<NotificationsHub>("/idpNotifications", o =>
                {
                    o.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.LongPolling | Microsoft.AspNetCore.Http.Connections.HttpTransportType.WebSockets;
                });

                endpoints.MapHub<O10InherenceHub>("/o10InherenceHub", o =>
                {
                    o.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.LongPolling | Microsoft.AspNetCore.Http.Connections.HttpTransportType.WebSockets;
                });
            });

            //app.UseSpa(spa =>
            //{
            //    // To learn more about options for serving an Angular SPA from ASP.NET Core,
            //    // see https://go.microsoft.com/fwlink/?linkid=864501

            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseAngularCliServer(npmScript: "start");
            //    }
            //});

            using var scope = app.ApplicationServices.CreateScope();
            scope.ServiceProvider.GetService<ApplicationDbContext>()?.Database.Migrate();
        }
    }
}
