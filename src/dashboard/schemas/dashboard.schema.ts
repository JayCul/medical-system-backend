import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Roles } from "src/auth/roles.enum";

export class DashboardConfig extends Document{
    @Prop({ enum: Roles, required: true, unique: true })
    userRole: Roles;

    @Prop({type: Boolean, default: true})
    showAlerts: boolean;

    @Prop({type: Boolean, default: true})
    showStatistics: boolean;

    @Prop({type: Boolean, default: false})
    enableCustomWidgets: boolean;

    @Prop({type: Object})
    customSettings: Record <string, any>;
}

export const dashboardConfigSchema = SchemaFactory.createForClass(DashboardConfig);