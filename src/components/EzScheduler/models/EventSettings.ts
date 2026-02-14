import { EventSettingsModel, FieldModel, EventData } from '../EzScheduler.types';

export class EventSettings implements EventSettingsModel {
    dataSource: Object[] | any;
    fields: FieldModel;
    allowAdding: boolean;
    allowDeleting: boolean;
    allowEditing: boolean;
    enableTooltip: boolean;
    template?: string | ((data: EventData) => React.ReactNode);

    constructor(settings: Partial<EventSettingsModel>) {
        this.dataSource = settings.dataSource || [];
        this.fields = {
            id: 'id',
            subject: 'subject',
            startTime: 'startTime',
            endTime: 'endTime',
            isAllDay: 'isAllDay',
            recurrenceRule: 'recurrenceRule',
            ...settings.fields
        };
        this.allowAdding = settings.allowAdding ?? true;
        this.allowDeleting = settings.allowDeleting ?? true;
        this.allowEditing = settings.allowEditing ?? true;
        this.enableTooltip = settings.enableTooltip ?? true;
        this.template = settings.template;
    }
}
