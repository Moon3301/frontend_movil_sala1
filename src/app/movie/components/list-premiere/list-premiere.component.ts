import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';

interface Card {
  title: string
  content: string
  image: string
}

@Component({
  selector: 'movie-list-premiere',
  standalone: false,
  animations: [
    trigger("fadeAnimation", [
      transition(":enter", [style({ opacity: 0 }), animate("300ms", style({ opacity: 1 }))]),
      transition(":leave", [animate("300ms", style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './list-premiere.component.html',
  styleUrl: './list-premiere.component.css'
})
export class ListPremiereComponent implements OnInit{

  cards: Card[] = [
    { title: "Card 1", content: "Content for card 1", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 2", content: "Content for card 2", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 3", content: "Content for card 3", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 4", content: "Content for card 4", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 5", content: "Content for card 5", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 6", content: "Content for card 6", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 7", content: "Content for card 7", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 8", content: "Content for card 8", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 9", content: "Content for card 9", image: "/placeholder.svg?height=200&width=300" },
    { title: "Card 10", content: "Content for card 10", image: "/placeholder.svg?height=200&width=300" },
  ]

  currentIndex = 0
  cardsPerView = 4
  cardWidth = 250 // Width of each card in pixels

  ngOnInit() {
    this.updateCardsPerView()
  }

  @HostListener("window:resize")
  onResize() {
    this.updateCardsPerView()
  }

  updateCardsPerView() {
    const containerWidth = window.innerWidth > 1200 ? 1200 : window.innerWidth - 40 // Max width or screen width minus padding
    this.cardsPerView = Math.floor(containerWidth / this.cardWidth)
    this.cardsPerView = Math.max(1, Math.min(this.cardsPerView, 4)) // Ensure between 1 and 4 cards
  }

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--
    }
  }

  get carouselTransform() {
    const shift = this.currentIndex * this.cardWidth
    return `translateX(-${shift}px)`
  }

  get bottomCard() {
    return this.cards[this.currentIndex]
  }

}
