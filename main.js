document.getElementById("apply-filter").addEventListener("click", function() {
    const year = document.getElementById("filter-year").value;
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    const subjects = Array.from(document.querySelectorAll('input[name="subject"]:checked')).map(el => el.value);
  
    console.log("Filt2222er Applied:", { year, categories, subjects });
  
    // Load and parse the local data.json file
    fetch('data.json')
      .then(response => response.json())
      .then(artworks => {
        // Filter artworks based on selected criteria
        const filteredArtworks = artworks.filter(artwork => {
          const yearMatch = !year || artwork.year === parseInt(year);
          const categoriesMatch = categories.length === 0 || 
            categories.some(cat => artwork.categories.includes(cat));
          const subjectsMatch = subjects.length === 0 || 
            subjects.some(sub => artwork.subjects.includes(sub));
          
          return yearMatch && categoriesMatch && subjectsMatch;
        });

        // Clear existing gallery
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        // Display filtered artworks
        filteredArtworks.forEach(artwork => {
          const artDiv = document.createElement('div');
          artDiv.className = 'artwork';
          artDiv.style.maxWidth = '300px';
          artDiv.style.display = 'flex';
          artDiv.style.flexDirection = 'column';
          artDiv.style.alignItems = 'center';
          artDiv.style.marginBottom = '20px';
          
          const img = document.createElement('img');
          img.src = `images/${artwork.image_name}`;
          img.alt = artwork.brief_info;
          img.style.width = '100%';
          img.style.height = 'auto';
          
          const info = document.createElement('p');
          info.textContent = artwork.brief_info;
          info.style.marginTop = '10px';
          info.style.fontSize = '14px';
          info.style.textAlign = 'center';
          
          artDiv.appendChild(img);
          artDiv.appendChild(info);
          gallery.appendChild(artDiv);
        });
      })
      .catch(error => {
        console.error('Error loading or parsing data.json:', error);
        document.getElementById('gallery').innerHTML = '<p>Error loading artwork data</p>';
      });
  });
  