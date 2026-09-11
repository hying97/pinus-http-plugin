import {PinusHttp} from "./lib/components/http";


export class PinusHttpPlugin {
    name = 'PinusHttp';
    components = [PinusHttp];
}

export function createPinusHttpPlugin():any {
    return new PinusHttpPlugin();
}

export const PomeloExports = {
    components: __dirname + '/lib/components/',
    events: __dirname + '/lib/events/'
};