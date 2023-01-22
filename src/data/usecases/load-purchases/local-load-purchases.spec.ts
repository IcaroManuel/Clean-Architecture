
import { CacheStoreSpy, mockPurchases } from "@/data/tests"
import { LocalLoadPurchases } from "./local-load-purchases"

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp =  new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)
    return {
      sut,
      cacheStore
    }
}


describe('LocalLoadPurchases', () => {
  test('should not delete or insert cache on sut.init', async () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  
  test('should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
    })
  
  test('should return a list of purchases if cache is less than 3 days old', async () => {
    const timestamp = new Date()
      const { cacheStore, sut } = makeSut(timestamp)
      cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases()
      }
      const purchases = await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(purchases).toBe(cacheStore.fetchResult.value)
    })
})
