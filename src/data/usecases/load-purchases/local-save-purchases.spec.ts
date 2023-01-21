
import { mockPurchases, CacheStoreSpy } from "@/data/tests"
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
  
  
  test('should not insert new cache if delete fails ', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
    await expect(promise).rejects.toThrow()
  })

  test('should insert new Cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    const promise = sut.save(purchases)
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    })
    await expect(promise).resolves.toBeFalsy()
})

test('should not insert new cache if delete fails ', async () => {
  const { cacheStore, sut } = makeSut()
  cacheStore.simulateInsertError()
  const promise = sut.save(mockPurchases())

  expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])

  await expect(promise).rejects.toThrow()
})
})
