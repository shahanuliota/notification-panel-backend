import {Module} from '@nestjs/common';
import {AuthModule} from 'src/common/auth/auth.module';
import {SettingAdminController} from 'src/common/setting/controllers/setting.admin.controller';
import {PermissionAdminController} from 'src/modules/permission/controllers/permission.admin.controller';
import {PermissionModule} from 'src/modules/permission/permission.module';
import {RoleAdminController} from 'src/modules/role/controllers/role.admin.controller';
import {RoleModule} from 'src/modules/role/role.module';
import {UserAdminController} from 'src/modules/user/controllers/user.admin.controller';
import {UserModule} from 'src/modules/user/user.module';
import {GroupModule} from "../../modules/group/group.module";
import {AppGroutController} from "../../modules/group/controllers/group.controller";

@Module({
    controllers: [
        SettingAdminController,
        UserAdminController,
        RoleAdminController,
        PermissionAdminController,
        AppGroutController
    ],
    providers: [],
    exports: [],
    imports: [UserModule, AuthModule, RoleModule, PermissionModule, GroupModule],
})
export class RoutesAdminModule {
}
