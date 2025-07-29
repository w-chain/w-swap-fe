import React from 'react'
import styled from 'styled-components'

const ReviewCards = () => {
  return (
    <ReviewCardsContainer>
      <Title>Power every move : Flip it, Skip it and Just hit it !</Title>
      
      <CardsWrapper>
        <ReviewImage src="/images/review-1.webp" alt="W Swap Review 1" />
        <ReviewImage src="/images/review-2.webp" alt="W Swap Review 2" />
        <ReviewImage src="/images/review-3.webp" alt="W Swap Review 3" />
      </CardsWrapper>
    </ReviewCardsContainer>
  )
}

export default ReviewCards

const ReviewCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 60px 20px;
  background: transparent;
`

const Title = styled.h2`
  font-family: Montserrat;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.2;
  text-align: center;
  color: #043F84;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
  }
`

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`

const ReviewImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 206, 162, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(67, 206, 162, 0.3);
  }
`