// Kartların listesi
var cards = [
  { id: 1, color: 'blue', logo: 'Mavi' },
  { id: 2, color: 'green', logo: 'Yeşil' },
  { id: 3, color: 'yellow', logo: 'Sarı' },
  { id: 4, color: 'red', logo: 'Kırmızı' }
];

// Oyuncunun sahip olduğu kartlar ve sayıları
var ownedCards = {};

// Rastgele kartları oluşturma fonksiyonu
function generateRandomCards() {
  var cardContainer = document.getElementById('cards-container');
  cardContainer.innerHTML = '';

  // Kartları karıştırma
  var shuffledCards = shuffleArray(cards.slice());

  // Kartları ekrana ekleme
  for (var i = 0; i < shuffledCards.length; i++) {
    var card = shuffledCards[i];
    var cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.backgroundColor = card.color;
    cardElement.textContent = '?';
    cardElement.dataset.cardId = card.id; // Kartın ID'sini veri özelliğine ata
    cardElement.dataset.clickCount = 0; // Kartın tıklama sayısını tutmak için veri özelliği ekle
    cardElement.addEventListener('click', revealCard.bind(null, cardElement));
    cardContainer.appendChild(cardElement);
  }
}

// Kartı açma fonksiyonu
function revealCard(cardElement) {
  var cardId = cardElement.dataset.cardId;
  var card = cards.find(function(c) {
    return c.id == cardId;
  });

  var clickCount = parseInt(cardElement.dataset.clickCount);
  if (clickCount >= 1) {
    return; // Kart zaten açılmış, daha fazla tıklamaya izin verme
  }

  cardElement.style.backgroundColor = card.color;
  cardElement.textContent = card.logo;
  cardElement.removeEventListener('click', revealCard);

  cardElement.dataset.clickCount = clickCount + 1; // Tıklama sayısını güncelle

  if (!ownedCards[cardId]) {
    ownedCards[cardId] = 1; // İlk kez çıkartılan kart, sayısını 1 olarak ayarla
  } else {
    ownedCards[cardId]++; // Daha önce çıkartılan kart, sayısını arttır
  }

  updateOwnedCardsCount(); // Sayıları güncelle
  saveOwnedCards(); // Kart koleksiyonunu kaydetme
}

// Dizi öğelerini karıştıran yardımcı fonksiyon
function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Kart koleksiyonunu kaydetme fonksiyonu
function saveOwnedCards() {
  localStorage.setItem('ownedCards', JSON.stringify(ownedCards));
}

// Kaydedilmiş kart koleksiyonunu yükleme fonksiyonu
function loadOwnedCards() {
  var savedCards = localStorage.getItem('ownedCards');
  if (savedCards) {
    ownedCards = JSON.parse(savedCards);
    updateOwnedCardsCount();
  }
}

// Sağ alt köşede kart sayılarını güncelleme fonksiyonu
function updateOwnedCardsCount() {
  var countContainer = document.getElementById('count-container');
  countContainer.innerHTML = '';

  for (var i = 0; i < cards.length; i++) {
    var cardId = cards[i].id;
    var count = ownedCards[cardId] || 0;

    var countElement = document.createElement('div');
    countElement.className = 'count';
    countElement.textContent = cards[i].logo + ' x' + count;
    countContainer.appendChild(countElement);
  }
}

// Kartları yenile butonuna tıklandığında çalışacak fonksiyon
function refreshCards() {
  generateRandomCards();
}

// Oyunu başlatma
generateRandomCards();

// Kaydedilmiş kart koleksiyonunu yükle
loadOwnedCards();
