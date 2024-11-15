const storageKey = "STORAGE_KEY";

const formAddingBook = document.getElementById("bookForm");
const formSearchingBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

formAddingBook.addEventListener("submit", function (event) {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const idTemp = document.getElementById("bookFormTitle").name;
  if (idTemp !== "") {
    const bookData = GetBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = GetBookList();
  RenderBookList(bookData);
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookList");
  const containerComplete = document.getElementById("completeBookList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("div");
    bookItem.classList.add('book_item', 'shadow', 'container');
    bookItem.setAttribute('data-bookid', id)
    bookItem.setAttribute('data-testid', 'bookItem');

    const textjudul = document.createElement('h3');
    textjudul.setAttribute('data-testid', 'bookItemTitle')
    textjudul.innerText = 'Judul ' + title;

    const textauthor = document.createElement('p');
    textauthor.setAttribute('data-testid', 'bookItemAuthor');
    textauthor.innerText = 'Penulis :' + author;

    const textyear = document.createElement('p');
    textyear.setAttribute('data-tesid', 'bookItemYear');
    textyear.innerText = 'Tahun :' + year;

    


     //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const isSelesai = isComplete ? "Belum selesai" : "Selesai";

    

    const buttongreen = document.createElement('button');
    buttongreen.setAttribute('data-tesid', 'bookItemIsCompleteButton');
    buttongreen.classList.add('btn-success');
    buttongreen.innerText = isSelesai + ' Di Baca';

    
    const buttonhapus = document.createElement('button');
    buttonhapus.setAttribute('data-tesid', 'bookItemDeleteButton');
    buttonhapus.classList.add('btn-submit');
    buttonhapus.innerText = 'Hapus';

    
    const buttonedit = document.createElement('button');
    buttonedit.setAttribute('data-tesid', 'bookItemEditButton');
    buttonedit.classList.add('btn-submit');
    buttonedit.innerText = 'Edit';

    containerActionItem.append(buttongreen, buttonhapus, buttonedit);


    bookItem.append(textjudul, textauthor, textyear, containerActionItem);
 
  // ubah selesai dibaca atau tidak dibaca
  buttongreen.addEventListener("click", function (event) {
    event.preventDefault();
    isCompleteBookHandler(id);

    const bookData = GetBookList();
    ResetAllForm();
    RenderBookList(bookData);
  });


  // Hapus Data
  buttonhapus.addEventListener("click", function (event) {
    event.preventDefault();
    DeleteAnItem(id);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
  });


  // ubah selesai dibaca atau tidak dibaca
 buttonedit.addEventListener("click", function (event) {
    event.preventDefault();

    const bookData = GetBookList();
    

    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == id) {
      //  con bookData[index].id = idupdate;
      const title =  bookData[index].title;
       const author = bookData[index].author;
     const getYear =   bookData[index].year;
     const year = parseInt(getYear);
     const isComplete =   bookData[index].isComplete;
  
     document.getElementById("bookFormTitle").value = title;
     document.getElementById("bookFormTitle").name = id;
     document.getElementById("bookFormAuthor").value = author;
     document.getElementById("bookFormYear").value = year;
     document.getElementById("bookFormIsComplete").checked = isComplete;

     document.getElementById("bookFormSubmit").innerHTML = 'Ubah Buku Ke Rak';  
      }
  
      
    }



    localStorage.setItem(storageKey, JSON.stringify(bookData));
    
  });



    //incomplete book
    if (isComplete === false) {
      containerIncomplete.append(bookItem);
       bookItem.childNodes[1].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });

      continue;
    }

    //complete book
    containerComplete.append(bookItem);

    bookItem.childNodes[1].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}




function isCompleteBookHandler(id) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = id;
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}


function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(id) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = id;
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}


searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
