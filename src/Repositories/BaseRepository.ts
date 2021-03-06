/// <reference path="../Contract/IRepository.ts" />
/// <reference path="../Helpers/Util.ts" />

namespace IndexedDB {
    export class BaseRepository<TDBContext extends IDBContext, TKey extends string | number> implements IRepository<TDBContext, TKey>{
        private _DBContext: TDBContext;
        private _StoreName: string;
        constructor(TContext: TDBContext, StoreName: string) {
            this._DBContext = TContext;
            this._StoreName = StoreName;
        }

        public Add(TObject: any): Promise<any> {
            var self = this;
            return this._DBContext.Begin().then(function (db: IDBDatabase) {
                var promise = Util.CreatePromise();
                var transaction = db.transaction([self._StoreName], "readwrite");
                var objectStore = transaction.objectStore(self._StoreName);
                var request = objectStore.add(TObject);
                request.onerror = (event: any) => {
                    promise.reject();
                    Util.Log("Fail");
                }
                request.onsuccess = (event: any) => {
                    promise.resolve();
                    Util.Log("success");
                }
                return promise;
            }, this.ErrorHandler)

        }

        public Update(TObject: any): Promise<any> {
            var self = this;
            return this._DBContext.Begin().then(function (db: IDBDatabase) {
                var promise = Util.CreatePromise();
                var transaction = db.transaction([self._StoreName], "readwrite");
                var objectStore = transaction.objectStore(self._StoreName);
                var request = objectStore.put(TObject);
                request.onerror = (event: any) => {
                    promise.reject();
                    Util.Log("Fail");
                }
                request.onsuccess = (event: any) => {
                    promise.resolve();
                    Util.Log("success");
                }
                return promise;
            }, this.ErrorHandler);

        }

        public Delete(Key: TKey): Promise<any> {
            var self = this;
            return this._DBContext.Begin().then(function (db: IDBDatabase) {
                var promise = Util.CreatePromise();
                var transaction = db.transaction([self._StoreName], "readwrite");
                var objectStore = transaction.objectStore(self._StoreName);
                var request = objectStore.delete(Key);
                request.onerror = (event: any) => {
                    promise.reject();
                    Util.Log("Fail");
                }
                request.onsuccess = (event: any) => {
                    promise.resolve();
                    Util.Log("success");
                }
                return promise;
            }, this.ErrorHandler)
        }

        public Get(TKey: any): Promise<any> {
            var self = this;
            return this._DBContext.Begin().then(function (db: IDBDatabase) {
                var promise = Util.CreatePromise();
                var transaction = db.transaction(self._StoreName, IDBTransaction.READ_ONLY);
                var objectStore = transaction.objectStore(self._StoreName);
                var retrievalRequest = objectStore.get(TKey);
                retrievalRequest.onsuccess = function (evt: any) {
                    var data = evt.target.result;
                    Util.Log("successfully");
                    promise.resolve(data);
                };
                retrievalRequest.onerror = function () {
                    promise.reject();
                    Util.Log("Fail");
                };
                return promise;
            }, this.ErrorHandler)
        }

        public GetAll(): Promise<any> {
            var self = this;
            return this._DBContext.Begin().then(function (db: IDBDatabase) {
                var dbCollection: any = [];
                var promise = Util.CreatePromise();
                var transaction = db.transaction(self._StoreName, IDBTransaction.READ_ONLY);
                var objectStore = transaction.objectStore(self._StoreName);
                var request = objectStore.openCursor();
                request.onsuccess = function (evt: any) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        dbCollection.push(cursor.value);
                        cursor.continue()
                    } else {
                        Util.Log("success");
                        Util.Log(dbCollection);
                        promise.resolve(dbCollection);
                    }
                };
                request.onerror = function () {
                    promise.reject();
                    Util.Log("Fail");
                };
                return promise;
            }, this.ErrorHandler)
        }

        public ErrorHandler(ex: string) {
            Util.Log(ex);
        }
    }
}