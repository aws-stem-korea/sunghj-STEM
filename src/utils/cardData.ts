import altArts from "./alternate-arts.json";
import promos from "./promos.json";

export function isDefined (v: string | string[] | boolean) {
  return typeof v !== "undefined" && v !== null;
}

export function cardImage (img: string, set: string, number: string) {
  if ( isDefined( img ) ) {
    return img;
  }
  if ( isDefined( set ) && isDefined( number ) ) {
    return `https://images.pokemontcg.io/${ set.toLowerCase() }/${ number }_hires.png`;
  }
  return "";
}

export function foilMaskImage ( prop: string | boolean, type = "masks", rarity: string, supertype: string, id: string, subtypes: string[], set: string, number: string, isReverse?: boolean) {
  //Shiny Vault Card (starts with sv)
  const isShiny = isDefined(number) && number.toLowerCase().startsWith( "sv" );
  //Trainer / Galar Gallery Card (not shiny)
  const isGallery = isDefined(number) && !!number.match(/^[tg]g/i);
  //Alternate Art Card (not shiny / gallery)
  const isAlternate = isDefined(id) && altArts.includes( id ) && !isShiny && !isGallery;
  //Promo Card
  const isPromo = isDefined(set) && set === "swshp";
  if ( isReverse ) rarity = rarity + " Reverse Holo";
  if ( isGallery ) {
    if ( isDefined(rarity) && rarity.startsWith( "Trainer Gallery" ) ) {
      rarity = rarity.replace( /Trainer Gallery\s*/, "" );
    }
    if ( isDefined(rarity) && rarity.includes( "Rare Holo V" ) && isDefined(subtypes) && subtypes.includes("VMAX") ) {
      rarity = "Rare Holo VMAX";
    }
    if ( isDefined(rarity) && rarity.includes( "Rare Holo V" ) && isDefined(subtypes) && subtypes.includes("VSTAR") ) {
      rarity = "Rare Holo VSTAR";
    }
  }
  if ( isPromo ) {
    if ( id === "swshp-SWSH076" || id === "swshp-SWSH077" ) {
      rarity = "Rare Secret";
    } else if ( isDefined(subtypes) && subtypes.includes("V") ) {
      rarity = "Rare Holo V";
    } else if ( isDefined(subtypes) && subtypes.includes("V-UNION") ) {
      rarity = "Rare Holo VUNION";
    } else if ( isDefined(subtypes) && subtypes.includes("VMAX") ) {
      rarity = "Rare Holo VMAX";
    } else if ( isDefined(subtypes) && subtypes.includes("VSTAR") ) {
      rarity = "Rare Holo VSTAR";
    } else if ( isDefined(subtypes) && subtypes.includes("Radiant") ) {
      rarity = "Radiant Rare";
    }
  }

  let etch = "holo";
  let style = "reverse";
  let ext = "webp";
  if ( isDefined( prop ) ) {
    if ( prop === false ) {
      return "";
    }
    return prop;
  }
  if( !isDefined( rarity ) || !isDefined( subtypes ) || !isDefined( supertype ) || !isDefined( set ) || !isDefined( number ) ) {
    return "";
  }
  const fRarity = rarity.toLowerCase();
  const fNumber = number.toString().toLowerCase().replace( "swsh", "" ).padStart( 3, "0" );
  const fSet = set.toString().toLowerCase().replace( /(tg|gg|sv)/, "" );
  if ( fRarity === "rare holo" ) style = "swholo";
  if ( fRarity === "rare holo cosmos" ) style = "cosmos";
  if ( fRarity === "radiant rare" ) {
    etch = "etched";
    style = "radiantholo";
  }
  if ( fRarity === "rare holo v" || fRarity === "rare holo vunion" || fRarity === "basic v" ) {
    etch = "holo";
    style = "sunpillar";
  }
  if ( fRarity === "rare holo vmax" || fRarity === "rare ultra" || fRarity === "rare holo vstar" ) {
    etch = "etched";
    style = "sunpillar";
  }
  if ( fRarity === "amazing rare" || fRarity === "rare rainbow" || fRarity === "rare secret" ) {
    etch = "etched";
    style = "swsecret";
  }
  if ( isShiny ) {
    etch = "etched";
    style = "sunpillar";

    if ( fRarity === "rare shiny v" || (fRarity === "rare holo v" && fNumber.startsWith( "sv" )) ) {
      rarity = "Rare Shiny V";
    }

    if ( fRarity === "rare shiny vmax" || (fRarity === "rare holo vmax" && fNumber.startsWith( "sv" )) ) {
      style = "swsecret";
      rarity = "Rare Shiny VMAX";
    }

  }
  if ( isGallery ) {
    etch = "holo";
    style = "rainbow";
    if ( fRarity.includes( "rare holo v" ) || fRarity.includes( "rare ultra" ) ) {
      etch = "etched";
      style = "sunpillar";
    }
    if ( fRarity.includes( "rare secret" ) ) {
      etch = "etched";
      style = "swsecret";
    }
  }

  if ( isAlternate ) {
    etch = "etched";
    if ( subtypes.includes( "VMAX" ) ) {
      style = "swsecret";
      rarity = "Rare Rainbow Alt";
    } else {
      style = "sunpillar";
    }
  }

  if ( isPromo ) {
    let promoStyle = (promos as any)[id];
    if ( promoStyle ) {
      style = promoStyle.style.toLowerCase();
      etch = promoStyle.etch.toLowerCase();
      if ( style === "swholo" ) {
        rarity = "Rare Holo";
      } else if ( style === "cosmos" ) {
        rarity = "Rare Holo Cosmos";
      }
    }

  }
  return `https://poke-holo.b-cdn.net/foils/${ fSet }/${ type }/upscaled/${ fNumber }_foil_${ etch }_${ style }_2x.${ ext }`;
}
