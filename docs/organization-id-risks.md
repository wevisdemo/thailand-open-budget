# Organization ids: names that will break

Audit of every ministry and budgetary unit across the budget documents in `public/data/`, run while choosing an id scheme for `/organizations/{ministry_id}/{budgetary_id}`.

**The conclusion in one line:** an organization's name is not a stable key. Names are edited in place between documents, municipalities are reclassified, one pair merged, and three units vanished for a year and came back. Any id derived from the name — Thai slug, romanised slug, or hash — silently orphans the URL in every case below.

Regenerate with `node scripts/audit-organizations.mjs --md > docs/organization-id-risks.md`.

## Scope

|                 | 2568 | 2569 | 2570 | union |
| --------------- | ---: | ---: | ---: | ----: |
| Ministries      |   32 |   33 |   33 |    33 |
| Budgetary units | 3014 | 3014 | 3317 |  3367 |

Pattern columns below read `2568 2569 2570`, where `1` means the name appears in that document.

## 1. Ministry level — low risk

Ministries are stable. Across all 3 documents: no renames, no spelling edits, and 1 membership change.

| Change        | Name                        |
| ------------- | --------------------------- |
| added in 2569 | รายจ่ายเพื่อชดใช้เงินคงคลัง |

No budgetary unit changed its parent ministry in any transition (0 found), so nesting a unit under its ministry in the URL is safe.

## 2. Names used at BOTH levels

These names are a ministry _and_ a budgetary unit — single-unit ministries. A flat name-keyed id cannot tell the two apart; the nested route makes them `/organizations/{id}/{same id}`.

| Name                        | Pattern |
| --------------------------- | :-----: |
| งบกลาง                      |   111   |
| รายจ่ายเพื่อชดใช้เงินคงคลัง |   011   |
| สภากาชาดไทย                 |   111   |
| ส่วนราชการในพระองค์         |   111   |

Decide whether a single-unit ministry renders the unit page directly instead of a ministry page with one child.

## 3. Same organization, spelling changed in place — HIGHEST RISK

7 names were edited between documents while remaining the same organization. Four of these are invisible on screen.

| From → To   | Old spelling                                                     | New spelling                                                    | Cause                                                                       |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2568 → 2569 | สำนักงานคณะกรรมการกฤษฏีกา                                        | สำนักงานคณะกรรมการกฤษฎีกา                                       | ฏ / ฎ consonant swap                                                        |
| 2568 → 2569 | เทศบาลตำบล กม.5 อำเภอเมืองประจวบคีรีขันธ์ จังหวัดประจวบคีรีขันธ์ | เทศบาลตำบลกม.5 อำเภอเมืองประจวบคีรีขันธ์ จังหวัดประจวบคีรีขันธ์ | whitespace                                                                  |
| 2568 → 2569 | เทศบาลตําบลบางหลวง อําเภอสรรพยา จังหวัดชัยนาท                    | เทศบาลตำบลบางหลวง อำเภอสรรพยา จังหวัดชัยนาท                     | `ํา` (U+0E4D U+0E32) vs `ำ` (U+0E33) — identical on screen, different bytes |
| 2568 → 2569 | เทศบาลตําบลบางปู อําเภอยะหริ่ง จังหวัดปัตตานี                    | เทศบาลตำบลบางปู อำเภอยะหริ่ง จังหวัดปัตตานี                     | `ํา` (U+0E4D U+0E32) vs `ำ` (U+0E33) — identical on screen, different bytes |
| 2568 → 2569 | เทศบาลตําบลในเมือง อําเภอเวียงเก่า จังหวัดขอนแก่น                | เทศบาลตำบลในเมือง อำเภอเวียงเก่า จังหวัดขอนแก่น                 | `ํา` (U+0E4D U+0E32) vs `ำ` (U+0E33) — identical on screen, different bytes |
| 2568 → 2569 | เทศบาลตําบลพรหมพิราม อําเภอพรหมพิราม จังหวัดพิษณุโลก             | เทศบาลตำบลพรหมพิราม อำเภอพรหมพิราม จังหวัดพิษณุโลก              | `ํา` (U+0E4D U+0E32) vs `ำ` (U+0E33) — identical on screen, different bytes |
| 2569 → 2570 | เทศบาลตำบลเวียง อำเภอไชยา จังหวัดสุราษฎร์ธานี                    | เทศบาลตำบลเวียง อำเภอไชยา จังหวัดสุราษฏร์ธานี                   | ฏ / ฎ consonant swap                                                        |

Notes:

- **`ํา` vs `ำ`** — the `เทศบาลตําบล` entries use U+0E4D (nikhahit) + U+0E32 (sara aa) where the others use U+0E33 (sara am). These render identically and Unicode NFC does **not** normalise one to the other, so they compare unequal and hash differently. Any import must normalise this pair explicitly.
- **`สุราษฎร์ธานี` → `สุราษฏร์ธานี`** (2569 → 2570) introduces an error rather than fixing one — spelling drift is not one-directional, so you cannot assume the newest document is canonical.

## 4. Municipality status upgrades — same body, new legal class

33 municipalities were reclassified (เทศบาลตำบล → เทศบาลเมือง → เทศบาลนคร). The name changes; the organization does not. Every one of these is a URL that must survive.

| From → To   | Old name                                                 | New name                                                  |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------- |
| 2568 → 2569 | เทศบาลตำบลกลางดง อำเภอทุ่งเสลี่ยม จังหวัดสุโขทัย         | เทศบาลเมืองกลางดง อำเภอทุ่งเสลี่ยม จังหวัดสุโขทัย         |
| 2568 → 2569 | เทศบาลตำบลเกาะขวาง อำเภอเมืองจันทบุรี จังหวัดจันทบุรี    | เทศบาลเมืองเกาะขวาง อำเภอเมืองจันทบุรี จังหวัดจันทบุรี    |
| 2568 → 2569 | เทศบาลตำบลคลองโยง อำเภอพุทธมณฑล จังหวัดนครปฐม            | เทศบาลเมืองคลองโยง อำเภอพุทธมณฑล จังหวัดนครปฐม            |
| 2568 → 2569 | เทศบาลตำบลโคกกลอย อำเภอตะกั่วทุ่ง จังหวัดพังงา           | เทศบาลเมืองโคกกลอย อำเภอตะกั่วทุ่ง จังหวัดพังงา           |
| 2568 → 2569 | เทศบาลตำบลเจ้าเจ็ด อำเภอเสนา จังหวัดพระนครศรีอยุธยา      | เทศบาลเมืองเจ้าเจ็ด อำเภอเสนา จังหวัดพระนครศรีอยุธยา      |
| 2568 → 2569 | เทศบาลตำบลชะมาย อำเภอทุ่งสง จังหวัดนครศรีธรรมราช         | เทศบาลเมืองชะมาย อำเภอทุ่งสง จังหวัดนครศรีธรรมราช         |
| 2568 → 2569 | เทศบาลตำบลดอนหัวฬ่อ อำเภอเมืองชลบุรี จังหวัดชลบุรี       | เทศบาลเมืองดอนหัวฬ่อ อำเภอเมืองชลบุรี จังหวัดชลบุรี       |
| 2568 → 2569 | เทศบาลตำบลท่ายาง อำเภอเมืองชุมพร จังหวัดชุมพร            | เทศบาลเมืองท่ายาง อำเภอเมืองชุมพร จังหวัดชุมพร            |
| 2568 → 2569 | เทศบาลตำบลเทพวงศา อำเภอเขมราฐ จังหวัดอุบลราชธานี         | เทศบาลเมืองเทพวงศา อำเภอเขมราฐ จังหวัดอุบลราชธานี         |
| 2568 → 2569 | เทศบาลตำบลนิคมพัฒนา อำเภอนิคมพัฒนา จังหวัดระยอง          | เทศบาลเมืองนิคมพัฒนา อำเภอนิคมพัฒนา จังหวัดระยอง          |
| 2568 → 2569 | เทศบาลตำบลเนินพระ อำเภอเมืองระยอง จังหวัดระยอง           | เทศบาลเมืองเนินพระ อำเภอเมืองระยอง จังหวัดระยอง           |
| 2568 → 2569 | เทศบาลตำบลบางไทร อำเภอบางไทร จังหวัดพระนครศรีอยุธยา      | เทศบาลเมืองบางไทร อำเภอบางไทร จังหวัดพระนครศรีอยุธยา      |
| 2568 → 2569 | เทศบาลตำบลบางพลับ อำเภอปากเกร็ด จังหวัดนนทบุรี           | เทศบาลเมืองบางพลับ อำเภอปากเกร็ด จังหวัดนนทบุรี           |
| 2568 → 2569 | เทศบาลตำบลบางเลน อำเภอบางใหญ่ จังหวัดนนทบุรี             | เทศบาลเมืองบางเลน อำเภอบางใหญ่ จังหวัดนนทบุรี             |
| 2568 → 2569 | เทศบาลตำบลบ้านบัว อำเภอเมืองบุรีรัมย์ จังหวัดบุรีรัมย์   | เทศบาลเมืองบ้านบัว อำเภอเมืองบุรีรัมย์ จังหวัดบุรีรัมย์   |
| 2568 → 2569 | เทศบาลตำบลบ้านบางม่วง อำเภอบางใหญ่ จังหวัดนนทบุรี        | เทศบาลเมืองบ้านบางม่วง อำเภอบางใหญ่ จังหวัดนนทบุรี        |
| 2568 → 2569 | เทศบาลตำบลบ้านเป็ด อำเภอเมืองขอนแก่น จังหวัดขอนแก่น      | เทศบาลเมืองบ้านเป็ด อำเภอเมืองขอนแก่น จังหวัดขอนแก่น      |
| 2568 → 2569 | เทศบาลตำบลบ้านสร้าง อำเภอบางปะอิน จังหวัดพระนครศรีอยุธยา | เทศบาลเมืองบ้านสร้าง อำเภอบางปะอิน จังหวัดพระนครศรีอยุธยา |
| 2568 → 2569 | เทศบาลตำบลประโคนชัย อำเภอประโคนชัย จังหวัดบุรีรัมย์      | เทศบาลเมืองประโคนชัย อำเภอประโคนชัย จังหวัดบุรีรัมย์      |
| 2568 → 2569 | เทศบาลตำบลปลายบาง อำเภอบางกรวย จังหวัดนนทบุรี            | เทศบาลเมืองปลายบาง อำเภอบางกรวย จังหวัดนนทบุรี            |
| 2569 → 2570 | เทศบาลตำบลโพนพิสัย อำเภอโพนพิสัย จังหวัดหนองคาย          | เทศบาลเมืองโพนพิสัย อำเภอโพนพิสัย จังหวัดหนองคาย          |
| 2568 → 2569 | เทศบาลตำบลมะขามคู่ อำเภอนิคมพัฒนา จังหวัดระยอง           | เทศบาลเมืองมะขามคู่ อำเภอนิคมพัฒนา จังหวัดระยอง           |
| 2568 → 2569 | เทศบาลตำบลรูสะมิแล อำเภอเมืองปัตตานี จังหวัดปัตตานี      | เทศบาลเมืองรูสะมิแล อำเภอเมืองปัตตานี จังหวัดปัตตานี      |
| 2568 → 2569 | เทศบาลตำบลลำปลายมาศ อำเภอลำปลายมาศ จังหวัดบุรีรัมย์      | เทศบาลเมืองลำปลายมาศ อำเภอลำปลายมาศ จังหวัดบุรีรัมย์      |
| 2568 → 2569 | เทศบาลตำบลเวียงสระ อำเภอเวียงสระ จังหวัดสุราษฎร์ธานี     | เทศบาลเมืองเวียงสระ อำเภอเวียงสระ จังหวัดสุราษฎร์ธานี     |
| 2568 → 2569 | เทศบาลตำบลศาลากลาง อำเภอบางกรวย จังหวัดนนทบุรี           | เทศบาลเมืองศาลากลาง อำเภอบางกรวย จังหวัดนนทบุรี           |
| 2568 → 2569 | เทศบาลตำบลสุเทพ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่     | เทศบาลเมืองสุเทพ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่     |
| 2568 → 2569 | เทศบาลตำบลเสาธงหิน อำเภอบางใหญ่ จังหวัดนนทบุรี           | เทศบาลเมืองเสาธงหิน อำเภอบางใหญ่ จังหวัดนนทบุรี           |
| 2568 → 2569 | เทศบาลตำบลหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์          | เทศบาลเมืองหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์          |
| 2568 → 2569 | เทศบาลเมืองบางบัวทอง อำเภอบางบัวทอง จังหวัดนนทบุรี       | เทศบาลนครบางบัวทอง อำเภอบางบัวทอง จังหวัดนนทบุรี          |
| 2568 → 2569 | เทศบาลเมืองบ้านสวน อำเภอเมืองชลบุรี จังหวัดชลบุรี        | เทศบาลนครบ้านสวน อำเภอเมืองชลบุรี จังหวัดชลบุรี           |
| 2568 → 2569 | เทศบาลเมืองมาบตาพุด อำเภอเมืองระยอง จังหวัดระยอง         | เทศบาลนครมาบตาพุด อำเภอเมืองระยอง จังหวัดระยอง            |
| 2568 → 2569 | เทศบาลเมืองหัวหิน อำเภอหัวหิน จังหวัดประจวบคีรีขันธ์     | เทศบาลนครหัวหิน อำเภอหัวหิน จังหวัดประจวบคีรีขันธ์        |

## 5. Merges — several ids must resolve to one page

A successor claimed by more than one predecessor:

| Pattern | Name                                                        |
| :-----: | ----------------------------------------------------------- |
|   100   | เทศบาลเมืองบุรีรัมย์ อำเภอเมืองบุรีรัมย์ จังหวัดบุรีรัมย์   |
|   100   | เทศบาลตำบลอิสาณ อำเภอเมืองบุรีรัมย์ จังหวัดบุรีรัมย์        |
|   011   | **เทศบาลนครบุรีรัมย์ อำเภอเมืองบุรีรัมย์ จังหวัดบุรีรัมย์** |

A merge is the one case a single `id` field cannot express: every predecessor id has to keep working and point at the successor, while the successor still has to show earlier figures filed under the old names. Needs an explicit decision.

## 6. Genuine renames

| From → To   | Old name                                           | New name                                                      | Similarity |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------- | ---------: |
| 2569 → 2570 | ศูนย์ความเป็นเลิศด้านชีววิทยาศาสตร์ (องค์การมหาชน) | สำนักงานเทคโนโลยีและนวัตกรรมด้านชีววิทยาศาสตร์ (องค์การมหาชน) |       0.61 |

This is TCELS. Nothing in the data links the two names — only domain knowledge does, which is why the import script has to surface the candidate for a human rather than decide.

## 7. Disappear and return

Present, absent, present. Fatal under any per-document index — the unit is renumbered on its return — and free under a persistent registry.

| Pattern | Name                                              | Ministry                 |
| :-----: | ------------------------------------------------- | ------------------------ |
|   101   | เทศบาลตำบลโคกพระ อำเภอกันทรวิชัย จังหวัดมหาสารคาม | องค์กรปกครองส่วนท้องถิ่น |
|   101   | เทศบาลตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี     | องค์กรปกครองส่วนท้องถิ่น |
|   101   | ธนาคารอาคารสงเคราะห์                              | รัฐวิสาหกิจ              |

## 8. Needs human review — ambiguous

The matcher paired these, but both names are alive in the final document, so they are probably two distinct bodies and the gap year is just a year with no allocation. Confirm before treating either as a rename.

| Candidate old                                     | Pattern | Candidate new                                         | Pattern | Similarity |
| ------------------------------------------------- | :-----: | ----------------------------------------------------- | :-----: | ---------: |
| เทศบาลตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี     |   101   | เทศบาลเมืองบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี        |   011   |       0.89 |
| เทศบาลตำบลโคกพระ อำเภอกันทรวิชัย จังหวัดมหาสารคาม |   101   | เทศบาลตำบลกันทรวิชัย อำเภอกันทรวิชัย จังหวัดมหาสารคาม |   011   |       0.83 |

## 9. Gone for good

Dissolved, absorbed, or simply no longer receiving an allocation. Their pages must keep working — earlier fiscal years still reference them.

| Last seen | Name                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| 2568      | บริษัท ขนส่ง จำกัด                                                                                             |
| 2568      | ธนาคารอาคารสงเคราะห์                                                                                           |
| 2568      | ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย                                                                     |
| 2568      | การประปานครหลวง                                                                                                |
| 2569      | สถาบันบริหารจัดการธนาคารที่ดิน (องค์การมหาชน)                                                                  |
| 2569      | สำนักงานพัฒนาพิงคนคร (องค์การมหาชน)                                                                            |
| 2569      | กองทุนยุติธรรม                                                                                                 |
| 2569      | สำนักงานคณะกรรมการส่งเสริมการลงทุน สำหรับกองทุนเพิ่มขีดความสามารถในการแข่งขันของประเทศสำหรับอุตสาหกรรมเป้าหมาย |

## 10. Structural hazards for any name-derived slug

**Length.** 14 names exceed 80 characters. Percent-encoded Thai costs 9 bytes per character, so these blow past any sane path-segment budget:

| Chars | Encoded | Name                                                                                                           |
| ----: | ------: | -------------------------------------------------------------------------------------------------------------- |
|   110 |     984 | สำนักงานคณะกรรมการส่งเสริมการลงทุน สำหรับกองทุนเพิ่มขีดความสามารถในการแข่งขันของประเทศสำหรับอุตสาหกรรมเป้าหมาย |
|   105 |     939 | สำนักงานปลัดกระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์ สำหรับกองทุนเพื่อการป้องกันและปราบปรามการค้ามนุษย์      |
|   103 |     909 | สำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม สำหรับกองทุนส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม        |
|   101 |     903 | สำนักงานคณะกรรมการป้องกันและปราบปรามการทุจริตแห่งชาติ สำหรับกองทุนป้องกันและปราบปรามการทุจริตแห่งชาติ          |
|    99 |     873 | ส่วนราชการไม่สังกัดสำนักนายกรัฐมนตรี กระทรวง หรือทบวง และหน่วยงานภายใต้การควบคุมดูแลของนายกรัฐมนตรี            |

**Non-Thai characters in names.** Present across the union: `(` ×40, `)` ×40, `-` ×8, `1` ×6, `2` ×6, `.` ×5, `5` ×2, `0` ×1, `8` ×1. All are legal in a path segment but need care in generated filenames for the static export.

## Method

1. Load every `public/data/budget_*.json`, collecting the distinct `ministry` and `budgetary` values per document.
2. **Within-document collisions:** group by a folded key (NFC, `ํา`→`ำ`, `ฏ`→`ฎ`, spaces stripped). Result: 0 — no document contradicts itself.
3. **Across documents:** diff the name sets. A disappearance whose folded key matches an appearance is a _spelling change_ (§3). Otherwise pair disappearances to appearances by Levenshtein similarity ≥ 0.55 and classify by municipality tier (§4–6).
4. **Presence pattern** per name across the documents catches return-after-absence (§7); a successor with several predecessors is a merge (§5); a pair both alive at the end is ambiguous (§8).

The similarity threshold is deliberately loose; it produced two false positives (§8), which is the right trade — a missed rename is a broken URL, a false positive is one line of review.

## What this means for the id scheme

| Scheme                     | Survives §3 spelling | Survives §4 upgrades | Survives §7 return | Handles §5 merge |
| -------------------------- | :------------------: | :------------------: | :----------------: | :--------------: |
| Thai name in path          |          no          |          no          |        yes         |        no        |
| Romanised / hashed name    |          no          |          no          |        yes         |        no        |
| Index recomputed per build |          no          |          no          |       **no**       |        no        |
| Append-only registry       |        yes\*         |        yes\*         |        yes         |      yes\*       |

\* with a human confirming the pairing the import script proposes. The registry does not detect these on its own — it makes intervention _possible_, which the other three schemes do not.

Concretely, the import step should fail loudly whenever a name disappears and an unclaimed name appears in the same run, printing the candidate pairs from §3–§6 for a human to accept or reject before ids are written.
