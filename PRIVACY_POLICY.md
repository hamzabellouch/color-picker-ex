# Privacy Policy - Color Picker

Last Updated: October 25, 2026


### 0. Rule 0: Disclaimer on Modified Builds, External Packages & Unofficial Forks:

- **Original Source Integrity:** This privacy policy, safety guarantees, and security features apply strictly and exclusively to the official, unmodified extension binaries and source code distributed directly through this official repository and its verified official releases.
- **Zero Liability for Modified / External Builds:** We (the publisher and maintainer) assume **no responsibility or liability whatsoever** for any modified extensions, third-party forks, repackaged `.crx` / `.xpi` / `.zip` archives, unofficial distribution channels, or altered projects not originating directly from this official repository. Any installation or use of modified, tampered, or third-party builds is entirely at your own risk, and the publisher assumes no responsibility for any consequences, damages, security compromises, or data breaches that may occur.


### 1. Executive Summary & Overview:

Color Picker is a lightweight, high-precision browser extension designed to allow users to inspect, sample, and convert any pixel color on their current webpage—featuring a live floating cursor badge, an interactive vertical shades bar, 15 comprehensive color formats, an isolated Shadow DOM interface, and customizable color format settings.

#### Core Privacy Commitment:
Color Picker operates **100% locally on your device**. We do **not** collect, store, transmit, share, or sell any personal data, screenshots, sampled color values, browsing history, device identifiers, or URLs to external servers, analytics providers, or third parties.


### 2. Information Processed On-Device:

To deliver its core eyedropper and color inspection functionality, Color Picker processes operations **strictly locally within your browser**:

- **On-Demand Viewport Capture:** When you click the extension toolbar icon or press `Alt + Shift + C`, the extension requests `chrome.tabs.captureVisibleTab` strictly to capture the current viewport for pixel sampling.
- **In-Memory Canvas Pixel Sampling:** The captured viewport is rendered onto an offscreen HTML5 `<canvas>` element entirely in local memory. Real-time mouse movement maps cursor coordinates to canvas coordinates to sample exact RGBA values using `ctx.getImageData()`.
- **Zero Cloud Processing & Immediate Buffer Cleanup:** All color sampling and mathematical format conversions take place inside local browser RAM. Raw viewport screenshots and canvas contexts are discarded immediately when the picker mode ends or is cancelled.
- **Local History & Preferences Storage:** Only your recent color swatches history (maximum 5 sampled colors) and your enabled format settings are persisted locally via `chrome.storage.local`. Browsing history, webpage content, and personal information are never saved to storage or disk.
- **No Browsing Tracking:** The extension never monitors, records, logs, or analyzes your browsing activity, user keystrokes, or the web pages you visit.


### 3. Permissions Used & Their Purposes:

Color Picker adheres to the principle of least privilege and requests only the minimal permissions required for operation:

**A. Active Tab (`activeTab`) & Tabs (`tabs`)**
- **Purpose:** Grants temporary, user-initiated permission to capture the visible viewport of the current active tab when you trigger the eyedropper and identify tab status.

**B. Scripting (`scripting`)**
- **Purpose:** Injects the interactive color picking overlay and card interface (`content.js`) into the active tab on demand.

**C. Storage (`storage`)**
- **Purpose:** Saves your enabled color formats configuration and recent color swatches history locally on your device so your preferences are preserved across sessions.

**D. Host Permissions (`<all_urls>`)**
- **Purpose:** Required to allow viewport capture and color sampling on any website you choose to inspect.

**E. Browser Specific Settings (Firefox Gecko ID: `color-picker@tkno`)**
- **Purpose:** Required by Mozilla Firefox for extension identification and Manifest V3 compatibility (Firefox 109+).


### 4. Safety & Content Handling Policy:

Color Picker complies strictly with modern browser security standards:

- **Strict Local Isolation:** The extension executes exclusively within the local browser runtime. No remote scripts (`eval`, remote script injection, or external CDN dependencies) are ever loaded or executed.
- **Shadow DOM UI Isolation:** The floating cursor badge and Color Picker card are rendered inside an encapsulated Shadow DOM root (`shadowHost.attachShadow({ mode: 'open' })`), completely isolating them from host page styles and scripts. Host webpage CSS cannot distort the extension, and webpage scripts cannot tamper with or read the picker's internal state.
- **Zero Data Exfiltration:** The extension possesses no background API endpoints, telemetry servers, or outbound network channels.
- **Safe Clipboard Operations:** Color format values are copied to your clipboard strictly upon explicit user interaction via the standard `navigator.clipboard.writeText` API.


### 5. Data Sharing, Analytics & Advertising:

- **No Data Sharing:** Zero user data, screenshots, or sampled color information leaves your browser.
- **No Third-Party Analytics / Telemetry:** Color Picker contains no tracking SDKs, Google Analytics, telemetry beacons, or behavioral monitoring tools.
- **No Advertisements:** Color Picker does not inject, display, or monetize advertisements of any kind.


### 6. Data Retention & Lifecycle:

- **Zero Remote Data Retention:** Because Color Picker does not collect or transmit personal data or screenshots, no user data is retained on any external server or database.
- **Immediate In-Memory Cleanup:** Viewport screenshots, image data URLs, and canvas contexts are immediately released from memory once color sampling concludes.
- **Complete Removal:** Uninstalling or disabling Color Picker instantly ceases all script execution and removes all extension files and local preference storage.


### 7. Managing Permissions & User Rights:

You maintain full control over Color Picker. You may disable or remove the extension at any time via your browser settings:

- **Chromium Browsers (Chrome, Edge, Brave, Opera, Vivaldi):** Navigate to `chrome://extensions/` (or `edge://extensions/`), locate **Color Picker**, and toggle it off or click **Remove**.
- **Mozilla Firefox:** Navigate to `about:addons` > **Extensions**, locate **Color Picker**, and choose **Disable** or **Remove**.


### 8. Contact & Support:

If you have any questions, suggestions, or concerns regarding this Privacy Policy or the security of Color Picker, please contact:  
**Email:** hamzabellouchcontact@gmail.com  
**GitHub:** [https://github.com/hamzabellouch/color-picker-ex](https://github.com/hamzabellouch/color-picker-ex)  


-------------------------------------------



# سياسة الخصوصية - Color Picker

آخر تحديث: ٢٥ أكتوبر ٢٠٢٦


### ٠. القاعدة رقم ٠: إخلاء المسؤولية عن الإضافات المعدلة والحزم الخارجية والمشاريع المشتقة:

* **سلامة المصدر الأصلي:** تنطبق سياسة الخصوصية، وضمانات الأمان، والميزات المذكورة في هذه الوثيقة حصرياً وصراحةً على الإصدارات الرسمية غير المعدلة من الإضافة والشفرة المصدرية المنشورة مباشرة عبر المستودع الرسمي المعتمد وصفحة إصداراته الرسمية فقط.
* **عدم تحمل المسؤولية عن النسخ المعدلة أو الخارجية:** نحن (الناشر والمطور) **لا نتحمل أي مسؤولية قانونية أو أمنية أو تقنية** عن تثبيت أو استخدام أي إضافات معدلة، أو حزم خارجية (`.crx` / `.xpi` / `.zip`)، أو نسخ مُعاد تجميعها، أو مشاريع مشتقة ومعدلة لا تنتمي لهذا المستودع الأصلي. كل ما ينتج عن استخدام أو تثبيت نسخ خارجية أو معدلة (من فقدان بيانات، أو ثغرات أمنية، أو برمجيات خبيثة، أو أي أضرار ناجمة) يقع بالكامل على عاتق المستخدم وحده دون أدنى مسؤولية على الناشر.


### ١. الملخص التنفيذي والنظرة العامة:

إضافة Color Picker هي أداة متصفح خفيفة وعالية الدقة لالتقاط الألوان، صُممت لتمكين المستخدمين من فحص واستخراج وتحويل درجات الألوان لأي بكسل على صفحات الويب فوراً—مع مؤشر عائم تفاعلي يتبع حركة الماوس، وشريط تدرجات رأسي، ودعم ١٥ صيغة لونية شاملة، وواجهة معزولة بتقنية Shadow DOM، ولوحة تحكم متكاملة في صيغ الألوان.

#### الالتزام الأساسي بالخصوصية:
تعمل إضافة Color Picker **بنسبة ١٠٠٪ محلياً داخل متصفحك**. نحن **لا نجمع**، ولا نخزن، ولا ننقل، ولا نشارك، ولا نبيع أي بيانات شخصية، أو لقطات شاشة، أو قيم ألوان ملتقطة، أو سجل التصفح، أو معرفات الأجهزة، أو عناوين المواقع (URLs) إلى أي خوادم تحليلات خارجية أو أطراف ثالثة.


### ٢. المعلومات والعمليات التي تتم معالجتها محلياً:

لأداء وظيفتها الأساسية المتمثلة في التقاط وتحديد الألوان بدقة، تقوم إضافة Color Picker بالعمليات التالية **محلياً وحصرياً داخل متصفحك**:

* **التقاط الشاشة عند الطلب:** عند النقر على أيقونة الإضافة في شريط الأدوات أو الضغط على الاختصار `Alt + Shift + C`، تستخدم الإضافة واجهة `chrome.tabs.captureVisibleTab` فقط لالتقاط مساحة العرض المرئية بهدف قراءة ألوان البكسل.
* **قراءة ومعالجة ألوان البكسل داخل الذاكرة:** يتم رسم لقطة الشاشة داخل عنصر `<canvas>` محلي في الذاكرة العشوائية للجهاز، وتتم قراءة درجات اللون (RGBA) لحظياً عند تحريك الماوس عبر واجهة `ctx.getImageData()`.
* **انعدام المعالجة السحابية والتفريغ الفوري:** تجري عمليات قراءة الألوان والتحويلات الرياضية للصيغ بالكامل داخل الذاكرة المؤقتة (RAM) للجهاز، ويتم التخلص من لقطة الشاشة وبيانات Canvas فور الانتهاء من عملية الالتقاط أو إلغائها.
* **تخزين محلي لتفضيلات الصيغ وسجل الألوان فقط:** تحتفظ الإضافة فقط بقائمة الصيغ المفعلة وسجل آخر ٥ ألوان ملتقطة في التخزين المحلي `chrome.storage.local`. لا يتم حفظ أي بيانات تصفح أو معلومات شخصية في التخزين الدائم.
* **عدم تتبع نشاط التصفح:** الإضافة لا ترصد، ولا تسجل، ولا تحلل المواقع التي تزورها أو المحتوى الذي تشاهده أو ضغطات المفاتيح.


### ٣. الأذونات المستخدمة وأغراضها:

تلتزم Color Picker بمبدأ الحد الأدنى من الصلاحيات ولا تطلب إلا الأذونات الضرورية لعملها:

**أ. التبويب النشط والتبويبات (`activeTab` و `tabs`)**
* **الغرض:** منح صلاحية مؤقتة للوصول إلى التبويب الحالي فقط عندما يقوم المستخدم بتفعيل القطارة لالتقاط مساحة العرض وتحديد حالة التبويب.

**ب. السكربتات البرمجية (`scripting`)**
* **الغرض:** حقن أداة المؤشر العائم والبطاقة المنبثقة (`content.js`) داخل التبويب النشط عند طلب الالتقاط.

**ج. التخزين المحلي (`storage`)**
* **الغرض:** حفظ اختيارك للصيغ اللونية المفضلة وسجل الألوان الملتقطة مؤخراً محلياً على جهازك لضمان ثبات تفضيلاتك عبر جلسات التصفح.

**د. صلاحية الوصول للمواقع (`<all_urls>`)**
* **الغرض:** مطلوبة لتمكين القطارة من فحص والتقاط الألوان على أي صفحة ويب تختار استخراج الألوان منها.

**هـ. إعدادات فايرفوكس الخاصة (Gecko ID: `color-picker@tkno`)**
* **الغرض:** مطلوب من قبل متصفح Mozilla Firefox لتعريف الإضافة وضمان توافقيتها مع مواصفات Manifest V3 (إصدار 109 فما فوق).


### ٤. سياسة الأمان والتعامل مع المحتوى:

تلتزم إضافة Color Picker بالمعايير الصارمة لأمان المتصفحات:

* **العزل المحلي التام:** تعمل الإضافة حصرياً داخل بيئة المتصفح المحلية. لا يتم تنزيل أو تنفيذ أي سكربتات أو أكواد برمجية خارجية (`eval` أو روابط CDN خارجية).
* **عزل الواجهة عبر Shadow DOM:** تُعرض بطاقة الألوان والمؤشر العائم داخل بيئة Shadow DOM معزولة، مما يحمي الواجهة من التأثر بأنماط CSS الخاصة بصفحات الويب المضيفة ويمنع سكربتات المواقع من قراءة بيانات الألوان الملتقطة.
* **انعدام تسريب البيانات:** لا تحتوي الإضافة على أي خوادم أو قنوات اتصال خارجية، ولا تقوم بأي طلبات شبكة أو اتصالات خارجية.
* **النسخ الآمن للحافظة:** يتم نسخ صيغ الألوان إلى الحافظة فقط عبر إجراء تفاعلي مباشر من المستخدم بواسطة واجهة المتصفح الآمنة `navigator.clipboard.writeText`.


### ٥. مشاركة البيانات والتحليلات والإعلانات:

* **عدم مشاركة البيانات:** لا تغادر أي لقطات شاشة، أو أكواد ألوان، أو معلومات تصفح جهازك على الإطلاق.
* **عدم وجود تحليلات أو تتبع من جهات خارجية:** لا تحتوي إضافة Color Picker على أي مكتبات تتبع، أو Google Analytics، أو خدمات Telemetry، أو أدوات مراقبة سلوك المستخدم.
* **خالية تماماً من الإعلانات:** لا تعرض الإضافة أو تحقن أو تروّج لأي نوع من الإعلانات التجارية أو البرمجيات الإعلانية.


### ٦. الاحتفاظ بالبيانات ودورة حياتها:

* **عدم الاحتفاظ بالبيانات:** نظراً لأن إضافة Color Picker لا تجمع ولا تنقل أي بيانات شخصية، فإنه لا توجد أي بيانات للمستخدم يتم الاحتفاظ بها على أي خوادم أو قواعد بيانات خارجية.
* **مسح فوري من الذاكرة:** يتم إفراغ لقطات الشاشة وبيانات Canvas من الذاكرة المؤقتة (RAM) فور اكتمال عملية الالتقاط.
* **الحذف الكامل:** يؤدي تعطيل أو إلغاء تثبيت إضافة Color Picker إلى إزالة كافة ملفات الإضافة وسجل الألوان وتفضيلات الصيغ فوراً وبشكل دائم.


### ٧. إدارة الأذونات وحقوق المستخدم:

تحتفظ بالتحكم الكامل في إضافة Color Picker، ويمكنك تعطيلها أو إزالتها في أي وقت من خلال إعدادات المتصفح:

* **متصفحات كروميوم (Chrome، Edge، Brave، Opera، Vivaldi):** توجه إلى `chrome://extensions/` (أو `edge://extensions/`)، ثم ابحث عن **Color Picker** وقم بإيقاف تفعيلها أو الضغط على **إزالة (Remove)**.
* **متصفح موزيلا فايرفوكس (Firefox):** توجه إلى `about:addons` ثم قسم **الملحقات (Extensions)**، وابحث عن **Color Picker** واختر **تعطيل (Disable)** أو **إزالة (Remove)**.


### ٨. التواصل والدعم:

إذا كانت لديك أي أسئلة أو استفسارات أو ملاحظات بخصوص سياسة الخصوصية هذه أو أمان إضافة Color Picker، يُرجى التواصل معنا عبر:  
**البريد الإلكتروني:** hamzabellouchcontact@gmail.com  
**مستودع GitHub:** [https://github.com/hamzabellouch/color-picker-ex](https://github.com/hamzabellouch/color-picker-ex)  
