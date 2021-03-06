"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherNotifier = void 0;
class WatcherDescriptor {
    constructor(files, directories, callback) {
        this.files = files;
        this.directories = directories;
        this.callback = callback;
    }
    shouldNotify(path) {
        return true;
    }
}
class WatcherNotifier {
    constructor() {
        this.descriptors = new Set();
    }
    notify(events) {
        for (const descriptor of this.descriptors) {
            for (const { path } of events) {
                if (descriptor.shouldNotify(path)) {
                    descriptor.callback([...events]);
                    break;
                }
            }
        }
    }
    watch(files, directories, callback) {
        const descriptor = new WatcherDescriptor(new Set(files), new Set(directories), callback);
        this.descriptors.add(descriptor);
        return { close: () => this.descriptors.delete(descriptor) };
    }
}
exports.WatcherNotifier = WatcherNotifier;
