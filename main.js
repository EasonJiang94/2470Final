document.getElementById("apply-filter").addEventListener("click", function() {
    const year = document.getElementById("filter-year").value;
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    const subjects = Array.from(document.querySelectorAll('input[name="subject"]:checked')).map(el => el.value);
  
    console.log("Filter Applied:", { year, categories, subjects });
  
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
                img.style.cursor = 'pointer'; // Indicate that the image is interactive
                img.addEventListener('click', () => {
                    showModal(artwork);
                });
                
                

                artDiv.appendChild(img);

                const info = document.createElement('p');
                info.textContent = artwork.brief_info;
                info.style.fontSize = '14px';
                info.style.textAlign = 'left';
                info.style.width = '50%';
                
                artDiv.appendChild(info);
                yearSection.appendChild(artDiv);
            });

            gallery.appendChild(yearSection);
        });
      })
      .catch(error => {
        console.error('Error loading or parsing data.json:', error);
        document.getElementById('gallery').innerHTML = '<p>Error loading artwork data</p>';
      });
});

// Function to show the modal with image and description
function showModal(artwork) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');

    modalImage.src = `images/${artwork.image_name}`;
    modalImage.alt = artwork.brief_info;
    modalDescription.textContent = artwork.description;

    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

// Add event listener to the close button
document.querySelector('.close-button').addEventListener('click', closeModal);

// Add event listener to close the modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeModal();
    }
});
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

