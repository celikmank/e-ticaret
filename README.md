# E-Ticaret (TechStore)

Bu depo, iki Angular uygulaması ve paylaşılan bir kütüphaneden oluşan bir NX monorepo'sudur.

Kısa özet
- `apps/admin`: Yönetici paneli (ürün/kategori/kullanıcı yönetimi).
- `apps/ui`: Mağaza ön yüzü (ürün listeleme, ürün detay vb.).
- `library/shared`: Paylaşılan TypeScript modelleri, HTTP interceptor ve yardımcı bileşen/pipe'lar.
- `db.json`: Örnek veritabanı (json-server ile servis edilir).

Çalıştırma (yerel)
1. Bağımlılıkları yükleyin:
```powershell
npm install
```
2. Örnek API (json-server) başlatın:
```powershell
npx json-server --watch db.json --port 3000
```
3. Uygulamaları başlatın:
```powershell
npx nx serve ui    # ön yüzü çalıştırır
npx nx serve admin # yönetici panelini çalıştırır
```

Önemli notlar
- İstemci kodu içinde `api/...` ile başlayan istekler, `library/shared/src/interceptors/endpoint-interceptor.ts` tarafından `http://localhost:3000/...` adresine yönlendirilir. Interceptor devrede değilse doğrudan `http://localhost:3000/...` kullanın.
- Paylaşılan modeller `@e-ticaret/shared` yol eşlemesi ile erişilebilir; bakmak için [tsconfig.base.json](tsconfig.base.json) dosyasını kontrol edin.
- Fiyat gösterimi için proje içinde bir `trCurrency` pipe kullanılmaktadır (template: `{{ price | trCurrency }}`).

Kod konvansiyonları
- `apps/*` uygulamaları standalone bileşenler ve Angular 21 özellikleri kullanır.
- Paylaşılan tipler `library/shared/src/models` içinde toplanmıştır.

Sorun giderme
- `api/...` istekleri HTML döndürüyorsa (index.html), ya `json-server` çalışmıyordur ya da interceptor kayıtlı değildir. Öncelikle `http://localhost:3000/products` adresini kontrol edin.

Geliştirme notu
- README'de eklemek istediğiniz kullanım örnekleri veya CI yönergeleri varsa belirtin; commit geçmişini düzenlemek istiyorsanız hangi commitleri değiştirmek istediğinizi söyleyin.

