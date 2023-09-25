import { MessagingService } from '../jslib/src/abstractions/messaging.service';

export class BroadcasterMessagingService implements MessagingService {
    constructor(private broadcasterService) { }

    send(subscriber: string, arg: any = {}) {
        const message = Object.assign({}, { command: subscriber }, arg);
        this.broadcasterService.send(message);
    }
}
