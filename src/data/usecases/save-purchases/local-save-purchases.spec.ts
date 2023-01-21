
import { mockPurchases, CacheStoreSpy } from "@/data/tests"
import { LocalSavePurchases } from "./local-save-purchases"

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    return {
      sut,
      cacheStore
    }
}


describe('LocalSavePurchases', () => {
  test('should not delete or insert cache on sut.init', async () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.messages).toEqual([])
  })
  
  
  test('should not insert new cache if delete fails ', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
    await expect(promise).rejects.toThrow()
  })

  test('should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
})

test('should not insert new cache if delete fails ', async () => {
  const { cacheStore, sut } = makeSut()
  cacheStore.simulateInsertError()
  const promise = sut.save(mockPurchases())

  expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])

  await expect(promise).rejects.toThrow()
})
})
