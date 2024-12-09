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
                // Start of Selection
                // Start Generation Here
                // Group the filtered artworks by year and sort them
                const artworksByYear = filteredArtworks.reduce((acc, artwork) => {
                    const year = artwork.year;
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(artwork);
                    return acc;
                }, {});

                const sortedYears = Object.keys(artworksByYear).sort((a, b) => a - b);

                sortedYears.forEach(year => {
                    const yearSection = document.createElement('div');
                    yearSection.className = 'year-section';
                    yearSection.style.marginBottom = '40px';

                    const yearHeader = document.createElement('h2');
                    yearHeader.textContent = `Year: ${year}`;
                    yearSection.appendChild(yearHeader);

                    artworksByYear[year].forEach(artwork => {
                        const artDiv = document.createElement('div');
                        artDiv.className = 'artwork';
                        artDiv.style.maxWidth = '600px';
                        artDiv.style.display = 'flex';
                        artDiv.style.flexDirection = 'row';
                        artDiv.style.alignItems = 'center';
                        artDiv.style.justifyContent = 'center'; 
                        artDiv.style.marginBottom = '20px';
                        
                        const img = document.createElement('img');
                        img.src = `images/${artwork.image_name}`;
                        img.alt = artwork.brief_info;
                        img.style.width = '50%';
                        img.style.height = 'auto';
                        img.style.marginRight = '20px';
                        
                        const info = document.createElement('p');
                        info.textContent = artwork.brief_info;
                        info.style.fontSize = '14px';
                        info.style.textAlign = 'left';
                        info.style.width = '50%';
                        
                        artDiv.appendChild(img);
                        artDiv.appendChild(info);
                        yearSection.appendChild(artDiv);
                    });

                    gallery.appendChild(yearSection);
                });

                // Optional: If you want to prevent the existing forEach from running,
                // you can comment it out by adding the following line:
                // filteredArtworks.forEach = () => {};
            // filteredArtworks.forEach(artwork => {
            //   const artDiv = document.createElement('div');
            //   artDiv.className = 'artwork';
            //   artDiv.style.maxWidth = '600px';
            //   artDiv.style.display = 'flex';
            //   artDiv.style.flexDirection = 'row';
            //   artDiv.style.alignItems = 'center';
            //   artDiv.style.justifyContent = 'center'; 
            //   artDiv.style.marginBottom = '20px';
              
            //   const img = document.createElement('img');
            //   img.src = `images/${artwork.image_name}`;
            //   img.alt = artwork.brief_info;
            //   img.style.width = '50%';
            //   img.style.height = 'auto';
            //   img.style.marginRight = '20px';
              
            //   const info = document.createElement('p');
            //   info.textContent = artwork.brief_info;
            //   info.style.fontSize = '14px';
            //   info.style.textAlign = 'left';
            //   info.style.width = '50%';
              
            //   artDiv.appendChild(img);
            //   artDiv.appendChild(info);
            //   gallery.appendChild(artDiv);
            // });
      })
      .catch(error => {
        console.error('Error loading or parsing data.json:', error);
        document.getElementById('gallery').innerHTML = '<p>Error loading artwork data</p>';
      });
  });
  