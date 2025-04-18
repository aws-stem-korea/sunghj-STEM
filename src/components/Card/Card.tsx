import { useAnimate } from "motion/react";
import { MouseMoveHandler, MouseOutHandler } from "@site/src/utils/cardAnimation";
import cardStyles from './style.module.css';
import Link from '@docusaurus/Link';
import { link } from "motion/react-client";

type CardProps = {
  clickHandler : (target: HTMLElement, x: number, y: number) => {},
  id?: string,
  img: string,
  type: string,
  service: string,
  description: string,
  mdlink: string
  altlink: string
}

export default function Card({
  clickHandler,
  id, img, description, type, service, mdlink, altlink
} : CardProps) {
  const back = "https://uploads.concordia.net/2023/02/16161824/1200px-Amazon_Web_Services_Logo.svg-1.png";
  const back_img = back;
  const front_img = require('@site/static/img/cards/'+img).default;

  const [scope, animate] = useAnimate()
  // const cardClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   e.nativeEvent.stopImmediatePropagation();
  //   const centerX = -(e.currentTarget.parentElement?.offsetLeft as number) -e.currentTarget.offsetLeft + window.scrollX + window.innerWidth / 2 - 165; 
  //   const centerY = -(e.currentTarget.parentElement?.offsetLeft as number) -e.currentTarget.offsetTop + window.scrollY + window.innerHeight / 2 - 229; 
  //   clickHandler(scope.current, centerX, centerY)
  // }

  return (
    <div
      className={cardStyles.cardBox}
      ref={scope}
      // onClick={(e) => {cardClickHandler(e)}}
    >
      <div
        onMouseMove={(e) => MouseMoveHandler(e)}
        onMouseOut={(e) => MouseOutHandler(e)}
        className={`${cardStyles.card} ${cardStyles[type]}`}
      >
        <div className={cardStyles.card__translater}>
          <Link 
            href={mdlink?.trim() 
              ? mdlink  // If mdlink exists, use it as is (internal link)
              : altlink.startsWith('http') 
                ? altlink  // If altlink already has http/https, use as is
                : `https://${altlink}`  // Otherwise add https:// to altlink
            }
            {...(!mdlink?.trim() && {
              target: "_blank",
              rel: "noopener"
            })}
          >
          <button className={cardStyles.card__rotator}>
            <img
              src={back_img}
              alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
              loading="lazy"
              width="660"
              height="660"
            />
            <div>
              <img
                src={front_img}
                alt="The front of a Pokemon Card, with the stats and info around the edge"
                loading="lazy"
                width="660"
                height="660"
              />
              <div className="shine"></div>
              <div className="glare"></div>
            </div>
          </button>
          </Link>
        </div>
      </div>
      <p className={cardStyles.serviceName}>{service} <span className={cardStyles.serviceDescription}> | {description}</span></p>
    </div>
  )
}