import { SchedulerEvent } from '../EzScheduler.types';

/**
 * Service for importing iCalendar (.ics) files
 */
export class ICalendarImportService {
    /**
     * Parse iCalendar content and convert to Scheduler events
     */
    parse(content: string | Blob): Promise<SchedulerEvent[]> {
        return new Promise((resolve, reject) => {
            if (content instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const text = reader.result as string;
                        const events = this.parseICalendarText(text);
                        resolve(events);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsText(content);
            } else {
                try {
                    const events = this.parseICalendarText(content);
                    resolve(events);
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    private parseICalendarText(text: string): SchedulerEvent[] {
        const events: SchedulerEvent[] = [];

        // Split by VEVENT blocks
        const veventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
        let match;

        while ((match = veventRegex.exec(text)) !== null) {
            const eventBlock = match[1];
            const event = this.parseVEvent(eventBlock);
            if (event) {
                events.push(event);
            }
        }

        return events;
    }

    private parseVEvent(block: string): SchedulerEvent | null {
        const lines = this.unfoldLines(block);

        let id = '';
        let title = '';
        let start: Date | null = null;
        let end: Date | null = null;
        let description = '';
        let rrule = '';
        let allDay = false;

        for (const line of lines) {
            const [key, value] = this.parseLine(line);

            switch (key) {
                case 'UID':
                    id = value;
                    break;
                case 'SUMMARY':
                    title = value;
                    break;
                case 'DTSTART':
                case 'DTSTART;VALUE=DATE':
                    start = this.parseDateTime(value);
                    if (key === 'DTSTART;VALUE=DATE') {
                        allDay = true;
                    }
                    break;
                case 'DTEND':
                case 'DTEND;VALUE=DATE':
                    end = this.parseDateTime(value);
                    break;
                case 'DESCRIPTION':
                    description = value;
                    break;
                case 'RRULE':
                    rrule = value;
                    break;
            }
        }

        if (!id || !title || !start || !end) {
            return null;
        }

        return {
            id,
            title,
            start,
            end,
            description,
            allDay,
            rrule: rrule || undefined,
        };
    }

    private unfoldLines(text: string): string[] {
        // iCalendar spec: lines can be folded with CRLF + space/tab
        const unfolded = text.replace(/\r\n[\t ]/g, '');
        return unfolded.split(/\r\n|\n/).filter(line => line.trim());
    }

    private parseLine(line: string): [string, string] {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            return ['', ''];
        }

        const key = line.substring(0, colonIndex);
        const value = line.substring(colonIndex + 1);

        return [key, this.unescapeValue(value)];
    }

    private parseDateTime(value: string): Date {
        // iCalendar format: 20240129T143000Z or 20240129
        if (value.length === 8) {
            // Date only: YYYYMMDD
            const year = parseInt(value.substring(0, 4));
            const month = parseInt(value.substring(4, 6)) - 1;
            const day = parseInt(value.substring(6, 8));
            return new Date(year, month, day);
        } else {
            // DateTime: YYYYMMDDTHHmmssZ
            const year = parseInt(value.substring(0, 4));
            const month = parseInt(value.substring(4, 6)) - 1;
            const day = parseInt(value.substring(6, 8));
            const hour = parseInt(value.substring(9, 11));
            const minute = parseInt(value.substring(11, 13));
            const second = parseInt(value.substring(13, 15));

            if (value.endsWith('Z')) {
                return new Date(Date.UTC(year, month, day, hour, minute, second));
            } else {
                return new Date(year, month, day, hour, minute, second);
            }
        }
    }

    private unescapeValue(value: string): string {
        return value
            .replace(/\\n/g, '\n')
            .replace(/\\,/g, ',')
            .replace(/\\;/g, ';')
            .replace(/\\\\/g, '\\');
    }
}
