export enum NotificationOptionEnum {
    toss = 'toss',
    firstInnings = 'firstInnings',
    lastInnings = 'lastInnings',
    timeInterval = 'timeInterval',
}


export const acceptedEvents = [
    NotificationOptionEnum.toss,
    NotificationOptionEnum.firstInnings,
    NotificationOptionEnum.lastInnings,
    NotificationOptionEnum.timeInterval,
];
