
import { CacheStoreSpy, getCacheExpirationDate } from "@/data/tests"
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

  test('should delete cache if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    await sut.validate()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    })

  test('should has no side effect if load succeds', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = { timestamp }
      await sut.validate()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
    })

    
  test('should delete cache if its expire', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = { timestamp }
      await sut.validate()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch,CacheStoreSpy.Action.delete])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(cacheStore.deleteKey).toBe('purchases')
})

  test('should delete cache if its on expiration date', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = { timestamp }
      await sut.validate()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(cacheStore.deleteKey).toBe('purchases')
})
})
