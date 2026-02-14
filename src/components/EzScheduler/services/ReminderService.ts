import { IService } from '../../../shared/services/ServiceRegistry';
import { SchedulerEvent, Reminder } from '../EzScheduler.types';

export class ReminderService implements IService {
    name = 'ReminderService';
    private timer: NodeJS.Timeout | null = null;
    private checkInterval = 60000; // Check every minute
    private onReminderTriggered?: (event: SchedulerEvent, reminder: Reminder) => void;

    constructor() { }

    start(onTrigger: (event: SchedulerEvent, reminder: Reminder) => void) {
        this.onReminderTriggered = onTrigger;
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.checkReminders(), this.checkInterval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private checkReminders() {
        // In a real implementation, this would check against the store of events
        // For now, this is a placeholder for the logic structure
        console.log('[ReminderService] Checking for due reminders...', this.onReminderTriggered);
    }

    /**
     * Calculates trigger time for a reminder
     */
    getTriggerTime(eventStart: Date, minutesBefore: number): Date {
        return new Date(eventStart.getTime() - minutesBefore * 60000);
    }

    cleanup() {
        this.stop();
    }
}
