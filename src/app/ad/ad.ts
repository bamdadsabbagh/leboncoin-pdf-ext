import {getIsoDateTime} from '../utils/get-iso-date-time';
import {PDF} from '../pdf/pdf';
import {FONT_SIZES, FONT_WEIGHTS} from '../constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const manifest = require('../../manifest-chrome.json');

export interface AdAttribute {
  generic: boolean;
  key: string;
  key_label?: string;
  value: string;
  value_label: string;
  values: string[];
}

export interface AdData {
  ad_type: string;
  attributes: AdAttribute[];
  body: string;
  category_id: string;
  category_name: string;
  expiration_date: string;
  first_publication_date: string;
  has_phone: boolean;
  is_boosted: boolean;
  images: {
    nb_images: number;
    small_url: string;
    thumb_url: string;
    urls: string[];
    urls_large: string[];
    urls_thumb: string[];
  };
  index_date: string;
  list_id: number;
  location: {
    city: string;
    city_label: string;
    country_id: string;
    department_id: string;
    department_name: string;
    feature: {
      geometry: {
        coordinates: number[];
        type: string;
      };
      properties: null;
      type: string;
    };
    is_shape: boolean;
    lat: number;
    lng: number;
    provider: string;
    region_id: string;
    region_name: string;
    source: string;
    zipcode: string;
  };
  options: {
    booster: boolean;
    gallery: boolean;
    has_option: boolean;
    photosup: boolean;
    sub_toplist: boolean;
    urgent: boolean;
  };
  owner: {
    activity_sector: string;
    name: string;
    no_salesmen: boolean;
    store_id: string;
    type: string;
    user_id: string;
    siren?: string;
  };
  price?: number[];
  price_calendar: null;
  price_cents: number;
  status: string;
  subject: string;
  url: string;
}

/**
 * Class representing an Ad.
 */
export class Ad {
  private readonly props: AdData;

  private readonly date: string;

  private readonly time: string;

  private readonly version: string = manifest.version;

  private pdf: PDF;

  constructor(props: AdData = Ad.parseLeboncoin()) {
    this.props = props;
    const {date, time} = getIsoDateTime();
    this.date = date;
    this.time = time;
    this.pdf = new PDF(this.getName());
  }

  private static parseLeboncoin(): AdData {
    try {
      const node = document.getElementById('__NEXT_DATA__');
      const data = node.innerHTML;
      const json = JSON.parse(data);
      return json.props.pageProps.ad;
    } catch (error) {
      throw new Error('Unable to get ad data');
    }
  }

  public export(): void {
    this.pdf.save();
  }

  public async build(): Promise<void> {
    this.buildHeader();
    this.pdf.printBreak();
    this.buildTitle();
    this.pdf.printBreak();
    this.buildSeller();
    this.pdf.printBreak();
    this.printAttributes();
    this.pdf.printBreak();
    this.buildDescription();
    await this.buildImages();
  }

  private getPrice() {
    return this.props?.price?.[0].toString() || '?';
  }

  private getPricePerSquareMeter() {
    const price = this.props.price[0];
    const square = this.props.attributes.find((attr) => attr.key === 'square');
    const squarePrice = Number(square.value);
    const pricePerSquareMeter = price / squarePrice;
    return pricePerSquareMeter.toFixed(0);
  }

  private getName() {
    return `${this.props.location.zipcode} - ${this.props.list_id} - ${this.props.subject} - ${this.getPrice()} euros`;
  }

  private async buildImages(): Promise<void> {
    let images;

    if (this.props.images.urls_large) {
      images = this.props.images.urls_large;
    } else if (this.props.images.urls) {
      images = this.props.images.urls;
    }

    if (!images) {
      return;
    }

    for (let k = 0; k < images.length; k++) {
      const image = images[k];

      await this.pdf.printImage({
        id: k + 1,
        total: images.length,
        url: image,
      });
    }
  }

  private get isRealEstateSale(): boolean {
    return this.props.category_name === 'Ventes immobilières';
  }

  private printAttributes(): void {
    // Title
    this.pdf.printText({
      text: 'Critères',
      weight: FONT_WEIGHTS.bold,
    });

    // Content
    this.props.attributes.forEach((attribute: AdAttribute) => {
      const title = attribute.key_label;
      const value = attribute.value_label;

      if (title) {
        this.pdf.printText({
          text: `${title} : ${value}`,
          size: FONT_SIZES.small,
        });
      }
    });

    if (this.isRealEstateSale) {
      this.pdf.printText({
        text: `Prix au m² : ${this.getPricePerSquareMeter()} €/m²`,
        size: FONT_SIZES.small,
      });
    }
  }

  private buildDescription(): void {
    // Title
    this.pdf.printText({
      text: 'Description',
      size: FONT_SIZES.normal,
      weight: FONT_WEIGHTS.bold,
    });

    // Content
    this.pdf.printBlock({
      text: this.props.body,
      size: FONT_SIZES.small,
    });
  }

  private buildSeller(): void {
    const {type} = this.props.owner;

    // Seller
    this.pdf.printText({
      text: 'Vendeur',
      size: FONT_SIZES.normal,
      weight: FONT_WEIGHTS.bold,
    });

    // Link
    this.pdf.printLink({
      text: `Vendeur ${type === 'private' ? 'particulier' : type} : ${this.props.owner.name}`,
      url: `https://www.leboncoin.fr/profil/${this.props.owner.user_id}`,
      size: FONT_SIZES.small,
    });

    // SIREN
    if (this.props.owner.siren) {
      this.pdf.printText({
        text: `SIREN : ${this.props.owner.siren}`,
        size: FONT_SIZES.xsmall,
      });
    }
  }

  private buildTitle(): void {
    // Title
    this.pdf.printText({
      text: this.props.subject,
      weight: FONT_WEIGHTS.bold,
    });

    // Price
    this.pdf.printText({
      text: `Prix : ${this.getPrice()} euros`,
      size: FONT_SIZES.small,
    });

    // Location
    this.pdf.printText({
      text: `Lieu : ${this.props.location.city}, ${this.props.location.zipcode}, ${this.props.location.department_name}`,
      size: FONT_SIZES.small,
    });

    // Satellite
    this.pdf.printText({
      text: `GPS : ${this.props.location.lat}, ${this.props.location.lng}`,
      size: FONT_SIZES.small,
    });

    // Google Maps
    this.pdf.printLink({
      text: 'Google Maps',
      url: `https://www.google.com/maps/place/${this.props.location.lat},${this.props.location.lng}`,
      size: FONT_SIZES.xsmall,
    });
  }

  private buildHeader(): void {
    // URL
    this.pdf.printLink({
      text: this.props.url,
      url: this.props.url,
      size: FONT_SIZES.small,
    });

    // Category
    this.pdf.printText({
      text: this.props.category_name,
      size: FONT_SIZES.small,
    });

    // Date of publication
    this.pdf.printText({
      text: `Première publication : ${this.props.first_publication_date}`,
      size: FONT_SIZES.xsmall,
    });

    // Date of last update
    this.pdf.printText({
      text: `Dernière mise à jour : ${this.props.index_date}`,
      size: FONT_SIZES.xsmall,
    });

    // Date, time of creation and version
    this.pdf.printText({
      text: `Edité le ${this.date} ${this.time}, version ${this.version}`,
      size: FONT_SIZES.xsmall,
    });
  }
}
