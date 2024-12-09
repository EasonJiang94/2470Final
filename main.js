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

        if (filteredArtworks.length === 0) {
            gallery.innerHTML = '<p>No artworks found for the selected criteria.</p>';
            return;
        }

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

            // Create a container for artworks to allow better layout
            const artworksContainer = document.createElement('div');
            artworksContainer.style.display = 'flex';
            artworksContainer.style.flexWrap = 'wrap';
            artworksContainer.style.gap = '20px';
            artworksContainer.style.justifyContent = 'center';

                // Start of Selection
                // Configure the artworksContainer for horizontal scrolling
                artworksContainer.style.flexWrap = 'nowrap';
                artworksContainer.style.overflowX = 'auto';
                artworksContainer.style.scrollBehavior = 'smooth'; // Optional for smooth scrolling
                artworksContainer.style.paddingBottom = '10px'; // Optional: Add some padding for scrollbar visibility

                artworksByYear[year].forEach(artwork => {
                    const artDiv = document.createElement('div');
                    artDiv.className = 'artwork';
                    // Optional: Set a fixed width for each artwork to ensure consistent layout
                    // artDiv.style.minWidth = '200px';

                    const img = document.createElement('img');
                    img.src = `images/${artwork.image_name}`;
                    img.alt = artwork.brief_info;
                    
                    // 添加點擊事件以顯示模態框
                    img.addEventListener('click', () => {
                        showModal(artwork);
                    });

                    artDiv.appendChild(img);

                    const info = document.createElement('p');
                    info.textContent = artwork.brief_info;
                    info.className = 'brief-info';
                    
                    artDiv.appendChild(info);

                    artworksContainer.appendChild(artDiv);
                });

            yearSection.appendChild(artworksContainer);
            gallery.appendChild(yearSection);
        });
      })
      .catch(error => {
        console.error('Error loading or parsing data.json:', error);
        document.getElementById('gallery').innerHTML = '<p>Error loading artwork data</p>';
      });
});

// Function to show the modal with image, description, and detail
function showModal(artwork) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalDetail = document.getElementById('modal-detail');
    const provideInfoForm = document.getElementById('provide-info-form');

    modalImage.src = `images/${artwork.image_name}`;
    modalImage.alt = artwork.brief_info;
    modalDescription.textContent = artwork.description;
    modalDetail.textContent = artwork.detail;

    // Hide the Provide Information form
    provideInfoForm.style.display = 'none';

    modal.classList.add('show');
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('show');
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

// Optional: Close modal with 'Escape' key for accessibility
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});


document.getElementById('provide-info-button').addEventListener('click', function() {
    const form = document.getElementById('provide-info-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('info-submit-button').addEventListener('click', function() {
    const email = document.getElementById('info-email').value;
    const message = document.getElementById('info-message').value;
    
    // Handle the submission (e.g., send to server)
    console.log('User provided info:', { email, message });
    alert('Thank you for your information!');
    
    // Clear the form and hide it
    document.getElementById('info-email').value = '';
    document.getElementById('info-message').value = '';
    document.getElementById('provide-info-form').style.display = 'none';
  });