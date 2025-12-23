import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Default content for pages
const defaultContent: Record<string, { title: string; content: string }> = {
  "uslovi-kupovine": {
    title: "Uslovi kupovine",
    content: `<h2>NARUČIVANJE</h2>
<p>Porudžbine možete izvršiti putem naše web stranice 24 sata dnevno, 7 dana u nedelji. Nakon što dodate proizvode u korpu i popunite podatke za dostavu, dobićete email potvrdu o vašoj porudžbini.</p>
<p>Minimalna vrednost porudžbine ne postoji. Sve cene na sajtu su izražene u dinarima (RSD) i uključuju PDV.</p>

<h2>DOSTAVA</h2>
<p>Dostava se vrši na teritoriji cele Srbije putem kurirske službe. Rok isporuke je 1-3 radna dana od momenta potvrde porudžbine.</p>
<ul>
<li>Porudžbine preko 4.000 RSD - <strong>BESPLATNA DOSTAVA</strong></li>
<li>Porudžbine ispod 4.000 RSD - dostava se naplaćuje 350 RSD</li>
</ul>

<h2>NAČINI PLAĆANJA</h2>
<p>Nudimo sledeće načine plaćanja:</p>
<ul>
<li>Plaćanje pouzećem (gotovina prilikom preuzimanja)</li>
<li>Plaćanje platnim karticama (Visa, Mastercard)</li>
<li>Plaćanje uplatnicom na račun</li>
</ul>

<h2>POVRAT ROBE</h2>
<p>U skladu sa Zakonom o zaštiti potrošača, imate pravo da odustanete od ugovora u roku od 14 dana od dana prijema robe, bez navođenja razloga.</p>
<p>Da biste ostvarili pravo na povrat, proizvod mora biti nekorišćen i u originalnom pakovanju.</p>

<h2>REKLAMACIJE</h2>
<p>U slučaju da primite oštećen proizvod ili proizvod koji ne odgovara vašoj porudžbini, molimo vas da nas kontaktirate u roku od 24 sata od prijema pošiljke.</p>`,
  },
  "politika-privatnosti": {
    title: "Politika privatnosti",
    content: `<p>House of Supplements poštuje vašu privatnost i posvećen je zaštiti vaših ličnih podataka.</p>

<h2>PRIKUPLJANJE PODATAKA</h2>
<p>Prikupljamo sledeće vrste podataka:</p>
<ul>
<li>Lični podaci: ime, prezime, email adresa, broj telefona, adresa za dostavu</li>
<li>Podaci o porudžbinama: istorija kupovine, omiljeni proizvodi</li>
<li>Tehnički podaci: IP adresa, tip pretraživača, podaci o uređaju</li>
</ul>

<h2>KORIŠĆENJE PODATAKA</h2>
<p>Vaše podatke koristimo za:</p>
<ul>
<li>Obradu i isporuku vaših porudžbina</li>
<li>Komunikaciju u vezi sa vašim porudžbinama</li>
<li>Slanje newsletter-a i promotivnih materijala (uz vašu saglasnost)</li>
<li>Poboljšanje naše web stranice i korisničkog iskustva</li>
</ul>

<h2>ZAŠTITA PODATAKA</h2>
<p>Preduzimamo odgovarajuće tehničke i organizacione mere za zaštitu vaših podataka od neovlašćenog pristupa, izmene, otkrivanja ili uništenja.</p>

<h2>VAŠA PRAVA</h2>
<p>U skladu sa zakonom, imate pravo da zatražite pristup, ispravku ili brisanje vaših ličnih podataka.</p>

<h2>KOLAČIĆI</h2>
<p>Naša web stranica koristi kolačiće za poboljšanje korisničkog iskustva.</p>`,
  },
  "kontakt": {
    title: "Kontakt",
    content: `<h2>KONTAKTIRAJTE NAS</h2>
<p>Imate pitanje ili vam je potrebna pomoć? Tu smo za vas!</p>

<h3>Lokacije</h3>
<p>Bulevar Oslobođenja 63<br>Vojvode Stepe 353</p>

<h3>Telefon</h3>
<p>064/4142-678<br>065/40-24-444</p>

<h3>Email</h3>
<p>info@houseofsupplements.rs</p>

<h3>Radno vreme</h3>
<p>Ponedeljak - Petak: 09:00 - 20:00<br>Subota: 09:00 - 15:00<br>Nedelja: Zatvoreno</p>`,
  },
  "o-nama": {
    title: "O nama",
    content: `<h2>NAŠA PRIČA</h2>
<p>House of Supplements je nastao iz ljubavi prema fitnesu i želje da sportistima u Srbiji obezbedimo pristup najboljim svetskim suplementima po pristupačnim cenama.</p>

<h2>NAŠA MISIJA</h2>
<p>Naša misija je jednostavna - da vam omogućimo pristup vrhunskim suplementima koji će vam pomoći da postignete svoje fitnes ciljeve, bilo da ste profesionalni sportista ili tek počinjete sa treningom.</p>
<p>Verujemo da svako zaslužuje pristup kvalitetnim proizvodima bez preterano visokih cena.</p>

<h2>ZAŠTO MI?</h2>
<ul>
<li><strong>100% Originalno</strong> - Garantujemo autentičnost svih proizvoda</li>
<li><strong>Brza dostava</strong> - Isporuka u roku od 1-3 radna dana</li>
<li><strong>Premium kvalitet</strong> - Samo provereni brendovi</li>
<li><strong>Stručna podrška</strong> - Tu smo da vam pomognemo sa savetima</li>
</ul>

<p>Hvala vam što ste deo naše priče. Vidimo se u teretani! 💪</p>`,
  },
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    // Get all pages from database
    const pages = await db.pageContent.findMany();

    // Create a map with existing pages
    const pagesMap: Record<string, { id: string; title: string; content: string }> = {};

    for (const page of pages) {
      pagesMap[page.id] = {
        id: page.id,
        title: page.title,
        content: page.content,
      };
    }

    // Fill in defaults for any missing pages
    for (const [id, defaults] of Object.entries(defaultContent)) {
      if (!pagesMap[id]) {
        pagesMap[id] = {
          id,
          title: defaults.title,
          content: defaults.content,
        };
      }
    }

    return NextResponse.json(pagesMap);
  } catch (error) {
    console.error("Get pages error:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, content } = body;

    if (!id || !title || content === undefined) {
      return NextResponse.json(
        { error: "Nedostaju obavezna polja" },
        { status: 400 }
      );
    }

    // Upsert the page content
    const page = await db.pageContent.upsert({
      where: { id },
      update: { title, content },
      create: { id, title, content },
    });

    return NextResponse.json({
      message: "Stranica je uspešno sačuvana",
      page,
    });
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}
