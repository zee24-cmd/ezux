import { View, ViewsModel, ViewType } from '../EzScheduler.types';

/**
 * Implementation model for scheduler view configuration.
 * @group Models
 */
export class ViewModel implements ViewsModel {
    /** 
     * The view mode.
     * @group Properties 
     */
    option: View;
    /** 
     * Whether virtual scrolling is enabled.
     * @group Properties 
     */
    allowVirtualScrolling: boolean;
    /** 
     * Display name for the view.
     * @group Properties 
     */
    displayName?: string;
    /** 
     * Start hour for the view.
     * @group Properties 
     */
    startHour?: string;
    /** 
     * End hour for the view.
     * @group Properties 
     */
    endHour?: string;
    /** 
     * Time interval in minutes.
     * @group Properties 
     */
    interval?: number;
    /** 
     * Whether to show weekends.
     * @group Properties 
     */
    showWeekend?: boolean;
    /** 
     * Whether this view is currently selected.
     * @group Properties 
     */
    isSelected?: boolean;

    constructor(view: View | ViewsModel) {
        if (typeof view === 'string') {
            this.option = view;
            this.allowVirtualScrolling = false;
        } else {
            this.option = view.option;
            this.allowVirtualScrolling = view.allowVirtualScrolling ?? false;
            this.displayName = view.displayName;
            this.startHour = view.startHour;
            this.endHour = view.endHour;
            this.interval = view.interval;
            this.showWeekend = view.showWeekend;
            this.isSelected = view.isSelected;
        }
    }

    static normalize(view: View | ViewsModel | ViewType): ViewModel {
        if (typeof view === 'string') {
            // Map legacy view types if needed
            const mapped = (view.charAt(0).toUpperCase() + view.slice(1)) as View;
            return new ViewModel(mapped);
        }
        return new ViewModel(view);
    }
}
