import * as postal from 'postal';

enum Status {
  Error = 'Error',
  Online = 'Online',
  Offline = 'Offline',
}

export default class System {
      #status: Status;

      #subs: Array<any>;

      protected sysName: string;

      protected channel: any;

      constructor() {
        this.#status = Status.Offline;
        this.sysName = 'UnnamedSystem';
        this.channel = postal.channel();
        this.#subs = [];
      }

      setStatus(newStatus: Status) {
        this.#status = newStatus;
      }

      getStatus() {
        return this.#status;
      }

      activate() {
        this.#status = Status.Online;
        this.channel.publish(`Systems.${this.sysName}.Online`, {
          sysName: this.sysName,
          sysStatus: this.#status,
        });
      }

      deactivate() {
        this.#status = Status.Offline;
        this.channel.publish(`Systems.${this.sysName}.Offline`, {
          sysName: this.sysName,
          sysStatus: this.#status,
        });
        this.clearSubscriptions();
      }

      throwError(thrownStr: string) {
        this.channel.publish('Error.Thrown', {
          sysName: this.sysName,
          errCode: thrownStr,
        });
      }

      newSubscription(sub: any) {
        this.#subs.push(sub);
      }

      clearSubscriptions() {
        this.#subs.forEach((e) => e.unsubscribe());
      }
}
