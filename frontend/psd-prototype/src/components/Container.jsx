import { useEffect, useCallback, useState, memo } from 'react';
import { Card } from './Card';
import axiosInstance from '../axios';
import update from 'immutability-helper';
const style = {
    width: 495,
};

export const Container = (props) => {
    {
        // get cards from layer's landmarks
        let options = ''
        if (props.layerlandmarks) {
            options = props.layerlandmarks
            .sort((a,b) => a.position > b.position ? 1 : -1)
            .map(e => (
                {
                    id: parseInt(`${e.id}`),
                    text: `${e.content}`.slice(0, 90),
                }
            ));
        }

        const [cards, setCards] = useState(
            options
        );

        // update displayed cards when current layer changes
        useEffect(() => 
            setCards(options), [props.currentlayer]
        );

        // handle cards being moved around
        const moveCard = useCallback((dragIndex, hoverIndex) => {
            const dragCard = cards[dragIndex];

            setCards(update(cards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }));
        }, [cards]);

        // reorder markers based on order of cards
        let marker = ''
        if (cards) {
            cards.forEach((card, index) => {
                marker = cards[index]
                const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
                                position: index,
                            }).then(response => {
                                props.rerenderParentCallback()
                            })
            })

            const renderCard = (card, index) => {
                return (<Card key={card.id} index={index} id={card.id} text={card.text} moveCard={moveCard}/>);
            };

            return (<>
                    <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
                </>);
        }
        // if no cards (i.e. no markers), return nothing
        else {
            return null
        }
    }
};
export default memo(Container);