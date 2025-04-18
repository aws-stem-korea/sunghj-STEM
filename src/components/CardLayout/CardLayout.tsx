import cards from "@site/static/data/cards.json";
import Card from "@site/src/components/Card/Card";
import { useState } from "react";
import { animate } from "motion";
import cardLayoutStyles from './style.module.css';

export default function CardLayout({ title, description }) {

  const [selectedCard, setSelectedCard] = useState<HTMLElement | undefined>();

  const clickHandler = (target: HTMLElement, centerX?: number, centerY?: number) => {
    if (selectedCard) {
      animate((selectedCard as HTMLElement)?.parentElement, {zIndex: 90}, { duration: 0 }).then((() => {
        animate(selectedCard, { scale: 1, x: 0, y: 0, zIndex: 1 }, { duration: 0.4 }).then(() => {
          animate(selectedCard, { zIndex: 0 }, { duration: 0 })
        })
      }))
    }
    if (selectedCard != target) {
      animate(target.parentElement, {zIndex: 999}, { duration: 0 }).then(() => {
        animate(target, { position: 'relative', zIndex: 999 }, { duration: 0 }).then(() => {
          animate(target, { scale: 1.5, x: centerX, y: centerY }, { duration: 0.5 })
        })
      })
    }
    setSelectedCard(selectedCard == target ? undefined : target);
    return true;
  };

  return (
    <main
      className={cardLayoutStyles.card_list}
      onClick={() => clickHandler(selectedCard as HTMLElement)}  
    >
      <p className={cardLayoutStyles.main_title}>
        {title}
      </p>
      <p>
        {description}
      </p>

      <div className={cardLayoutStyles['card-grid']}>
        {cards.map((card) => (
          <Card
            key={card.service}
            img={card.image}
            type={card.type}
            service={card.service}
            description={card.description}
            mdlink={card.mdlink}
            clickHandler={clickHandler}
          />
        )
        )}
      </div>
    </main>
  )
}