"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserWalletsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var UserWalletsComponent = /** @class */ (function () {
    function UserWalletsComponent(accountsService, messagesSerivce) {
        this.accountsService = accountsService;
        this.messagesSerivce = messagesSerivce;
        this.accounts = [];
        this.registerAccountMode = false;
        this.alias = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.password = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.displayedColumns = ['accountId', 'accountInfo'];
    }
    UserWalletsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.accountsService.get(3).subscribe(function (r) {
            _this.accounts = r;
        });
    };
    UserWalletsComponent.prototype.onAddAccount = function () {
        this.registerAccountMode = true;
    };
    UserWalletsComponent.prototype.onCancelRegistration = function () {
        this.registerAccountMode = false;
    };
    UserWalletsComponent.prototype.onRegister = function () {
        var _this = this;
        if (this.alias.invalid || this.password.invalid) {
            return;
        }
        this.accountsService.register(3, this.alias.value, this.password.value).subscribe(function (r) {
            _this.messagesSerivce.add("Account " + _this.alias.value + " registered successfully");
            _this.registerAccountMode = false;
        });
    };
    UserWalletsComponent.prototype.getAliasErrorMessage = function () {
        if (this.alias.hasError('required')) {
            return 'You must enter a value';
        }
    };
    UserWalletsComponent.prototype.getPasswordErrorMessage = function () {
        if (this.alias.hasError('required')) {
            return 'You must enter a value';
        }
    };
    UserWalletsComponent = __decorate([
        core_1.Component({
            selector: 'app-user-wallets',
            templateUrl: './user-wallets.component.html',
            styleUrls: ['./user-wallets.component.scss']
        })
    ], UserWalletsComponent);
    return UserWalletsComponent;
}());
exports.UserWalletsComponent = UserWalletsComponent;
