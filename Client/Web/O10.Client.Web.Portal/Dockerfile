#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Client/Web/O10.Client.Web.Portal/O10.Client.Web.Portal.csproj", "Client/Web/O10.Client.Web.Portal/"]
COPY ["Integrations/Rsk/O10.Integrations.Rsk.Web/O10.Integrations.Rsk.Web.csproj", "Integrations/Rsk/O10.Integrations.Rsk.Web/"]
COPY ["Integrations/Rsk/Wrappers/O10Idp/O10Idp.csproj", "Integrations/Rsk/Wrappers/O10Idp/"]
RUN dotnet restore "Client/Web/O10.Client.Web.Portal/O10.Client.Web.Portal.csproj"
COPY . .
WORKDIR "/src/Client/Web/O10.Client.Web.Portal"
RUN dotnet build "O10.Client.Web.Portal.csproj" -c Debug -o /app/build

FROM build AS publish
RUN dotnet publish "O10.Client.Web.Portal.csproj" -c Debug -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "O10.Client.Web.Portal.dll"]