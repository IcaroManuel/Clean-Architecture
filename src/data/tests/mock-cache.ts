import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"
import { SavePurchases } from "@/domain/usecases"


export class CacheStoreSpy implements CacheStore  {
  deleteCallsCount = 0
  deleteKey: string
  insertCallsCount = 0
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  delete (key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
  this.insertCallsCount++
  this.insertKey = key
  this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
  }

  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error()
    })
  }
}

