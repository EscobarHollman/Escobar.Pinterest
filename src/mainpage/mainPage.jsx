import '../App.css';
import React, { useState, useEffect } from 'react';
import { imageDB } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

export default function MainPage({ setLoggedin }) {
  const [activeTag, setActiveTag] = useState('home');

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  return (
    <div className="MainPage">
      <HeaderMainPage
        activeTag={activeTag}
        handleTagClick={handleTagClick}
        setLoggedin={setLoggedin}
      />
      <MainScreenDecider
        activeTag={activeTag}
        handleTagClick={handleTagClick}
      />
    </div>
  );
}

function HeaderMainPage({ activeTag, handleTagClick, setLoggedin }) {
  const usernameheader = localStorage.getItem('username');
  const useremailheader = localStorage.getItem('useremail');
  const userimageheader = localStorage.getItem('userphoto');
  var menu = false;

  const showmenu = () => {
    menu = !menu;
    if (menu == true) {
      document.getElementById('menubar').style.display = 'flex';
    } else {
      document.getElementById('menubar').style.display = 'none';
    }
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Sign-out successful');
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
        localStorage.removeItem('userphoto');
        setLoggedin(false);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div className="Header">
      <div className="contPrim">
        <div className="logo">
          <img
            src="pintrestlogo.png"
            alt="pintrestLogo"
            className="headLogo"
          />
        </div>
        <div
          className={`tag ${activeTag === 'home' ? 'activetag' : ''}`}
          id="hometag"
          onClick={() => handleTagClick('home')}
        >
          Inicio
        </div>
        <div
          className={`tag ${activeTag === 'explore' ? 'activetag' : ''}`}
          id="Exploretag"
          onClick={() => handleTagClick('explore')}
        >
          Explorar
        </div>
        <div
          className={`tag ${activeTag === 'create' ? 'activetag' : ''}`}
          id="Createtag"
          onClick={() => handleTagClick('create')}
        >
          Crear
        </div>
      </div>
      <div className="contSeg">
        <input
          type="text"
          name="search"
          id="Searchbar"
          className="busq"
          placeholder="🔎 Buscar"
        />
      </div>
      <div className="contTri">
        <div className="uno">
          <div className="notification">
            <img
              src="notification.png"
              alt="notification"
              className="trisectionimage"
            />
          </div>
          <div className="notification">
            <img
              src="chat.png"
              alt="notification"
              className="trisectionimage"
            />
          </div>
          <div className="userprofileimage">
            <img
              src={userimageheader}
              alt="userimage"
              className="userprofileimage"
            />
          </div>
          <div className="notification">
            <img
              src="down.png"
              alt="notification"
              className="downarrow"
              onClick={showmenu}
            />
          </div>
        </div>
        <div className="dos" id="menubar">
          <div className="personalinfo">
            <div className="personalprofileimage">
              <img
                src={userimageheader}
                alt="userimage"
                className="personalprofileimageimg"
              />
            </div>
            <div className="personaprofiledetails">
              <div className="personalprofilename">{usernameheader}</div>
              <div className="personalprofileemail">{useremailheader}</div>
            </div>
          </div>

          <div className="salirboton" onClick={handleSignOut}>
            Salir de la cuenta
          </div>
        </div>
      </div>
    </div>
  );
}

function MainScreenDecider({ activeTag, handleTagClick }) {
  return activeTag === 'home' ? (
    <HomePage handleTagClick={handleTagClick} />
  ) : activeTag === 'explore' ? (
    <ExplorePage />
  ) : activeTag === 'details' ? (
    <DetailsPage handleTagClick={handleTagClick} />
  ) : (
    <CreatePage />
  );
}

function HomePage({ activeTag, handleTagClick }) {
  const [items, setItems] = useState([]);
  var ind = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {

        const postsCollectionRef = collection(firestore, 'posts');

        const querySnapshot = await getDocs(postsCollectionRef);

        const fetchedData = [];


        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            id: ind, 
            title: data.title,
            accountid: data.email,
            description: data.description,
            displayimageurl: data.imageUrl, 
            link: data.link,
            maxht: '450px',
            name: data.displayName,
            likes: data.likes, 
          });
          ind++;
        });

        setItems(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [[], [], [], [], [], []]; 
  items.forEach((item, index) => {
    const shortestColumnIndex = columns.reduce(
      (acc, col, idx) => (col.length < columns[acc].length ? idx : acc),
      0
    );
    columns[shortestColumnIndex].push(item);
  });

  function savedata(
    img,
    desc,
    title,
    link,
    usernameprev,
    useremailprev,
    docid,
    likes
  ) {
    localStorage.setItem('imageprev', img);
    localStorage.setItem('descriptionprev', desc);
    localStorage.setItem('titleprev', title);
    localStorage.setItem('linkprev', link);
    localStorage.setItem('nameprev', usernameprev);
    localStorage.setItem('emailprev', useremailprev);
    localStorage.setItem('docidprev', docid);
    localStorage.setItem('likesprev', likes);
    handleTagClick('details');
  }

  return (
    <div className="iniciopage">
      {columns.map((column, index) => (
        <div key={index} className="column">
          {column.map((item) => (
            <div
              key={item.id}
              className="imagediv"
              style={{
                maxWidth: '100%',
              }}
            >
              <img
                src={item.displayimageurl}
                alt={item.name}
                className="displayimageimage"
                onClick={() =>
                  savedata(
                    item.displayimageurl,
                    item.description,
                    item.title,
                    item.link,
                    item.name,
                    item.accountid,
                    item.id,
                    item.likes
                  )
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExplorePage() {
  return <div>Explorepage</div>;
}


let downloadUrl = '';

function CreatePage() {
  const [selectedImage, setSelectedImage] = useState(null);

  var placeholderimage =
    'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1712620800&semt=sph';


  const uploadImageToStorage = async (file) => {
    try {
      const storageRef = ref(
        imageDB,
        `files/${localStorage.getItem('useremail')}_${uuidv4()}`
      );

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);


      downloadUrl = url;

      console.log(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null; 
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onload = async () => {
        setSelectedImage(reader.result); 
        const imageUrl = await uploadImageToStorage(file);
        console.log('Download URL:', imageUrl);
      };
      reader.readAsDataURL(file); 
    }
  };

  const storeDataInFirestore = async (
    title,
    description,
    link,
    imageUrl,
    displayName,
    email,
    likes
  ) => {
    try {
      const firestoreCollection = collection(firestore, 'posts');

      const docRef = await addDoc(firestoreCollection, {
        title: title,
        description: description,
        link: link,
        imageUrl: imageUrl,
        displayName: displayName,
        email: email,
        likes: 0,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handlePublish = async () => {
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var link = document.getElementById('link').value;
    var email = localStorage.getItem('useremail');
    var displayName = localStorage.getItem('username');

    if (downloadUrl != '' && title != '' && description != '' && link != '') {
      await storeDataInFirestore(
        title,
        description,
        link,
        downloadUrl,
        displayName,
        email
      )
        .then(() => {
          document.getElementById('title').value = '';
          document.getElementById('description').value = '';
          document.getElementById('link').value = '';
          setSelectedImage(null);
          downloadUrl = ''; 
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error('Insufficient Data here to Upload.');
    }
  };

  return (
    <div className="crearpage">
      <div className="crearpinhead">
        <div className="headtext">Subir foto</div>
        <div className="subirboton" onClick={handlePublish}>
          Publicar
        </div>
      </div>

      <div className="uploaddiv">
        <div className="uploadimagediv">
          {}
          {selectedImage && (
            <div className="displaydiv">
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: '60%',
                  maxHeight: '450px',
                  borderRadius: '20px',
                  marginBottom: '30px',
                }}
              />
            </div>
          )}
          {}
          {!selectedImage && (
            <div>
              <img
                src={placeholderimage}
                alt="Placeholder"
                style={{
                  maxWidth: '100%',
                  borderRadius: '20px',
                  marginBottom: '30px',
                }}
              />
            </div>
          )}
          {}
          <input
            type="file"
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>

        <div className="uploaddetailsdiv">
          <div className="input-group title">
            <label className="label">Titulo de la foto</label>
            <input
              autoComplete="off"
              name="Email"
              id="title"
              className="input"
              type="text"
            />
            <div></div>
          </div>
          <div className="input-group title">
            <label className="label">Descripcion</label>
            <textarea
              autoComplete="off"
              name="Email"
              id="description"
              className="input"
              type="text"
              draggable
            />
            <div></div>
          </div>
          <div className="input-group title">
            <label className="label">URL</label>
            <input
              autoComplete="off"
              name="Email"
              id="link"
              className="input"
              type="text"
            />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsPage({ activeTag, handleTagClick }) {
  return (
    <div className="detailspg">
      <div className="backbuttondetails" onClick={() => handleTagClick('home')}>
        <img src="back.png" alt="" className="backimg" />
      </div>
      <div className="centerdiv">
        <div
          className="imageprevdiv"
          style={{
            backgroundImage: `url(${localStorage.getItem('imageprev')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '50%', 
            height: '100%',
          }}
        >
          {}
        </div>
        <div className="imagedetailsdiv">
          <div className="detailsprevheader">
            <div className="unoprevhead">
              <img src="upload.png" alt="upload" className="uploadimageimg" />
              <img src="more.png" alt="upload" className="uploadimageimg" />
            </div>
            <div className="dosprevhead">
              <div className="guardarboton">Guardar</div>
            </div>
          </div>

          <div className="linkprev">
            <a href={localStorage.getItem('linkprev')}>
              {localStorage.getItem('linkprev')}
            </a>
          </div>

          <div className="titleprev">{localStorage.getItem('titleprev')}</div>

          <div className="descprev">
            {localStorage.getItem('descriptionprev')}
          </div>

          <div className="profilediv">
            <div className="profone">
              <div className="profilepictureprev"></div>
              <div className="profilenameprev">
                {localStorage.getItem('nameprev')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
