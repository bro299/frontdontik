document.getElementById('downloadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;
    console.log(`URL entered: ${videoUrl}`); // Log URL input

    try {
        document.getElementById('loadingSpinner').style.display = 'block';
        console.log('Sending request to backend'); // Log request initiation

        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        const data = await response.json();
        document.getElementById('loadingSpinner').style.display = 'none';
        console.log(`Received response: ${JSON.stringify(data)}`); // Log response

        if (data.images && data.images.length > 0) {
            const images = data.images.map((img, index) => `
                <div class="card mx-auto" style="width: 18rem;">
                    <img src="${img}" class="card-img-top" alt="Image ${index + 1}">
                    <div class="card-body">
                        <a href="${img}" class="btn btn-primary" download="TikTok_Image_${index + 1}.jpg">Download Image ${index + 1}</a>
                    </div>
                </div>
            `).join('');
            document.getElementById('result').innerHTML = images;
        } else if (data.videos && data.videos.length > 0) {
            const video = data.videos[0];
            const title = data.title || 'No Title';
            const fileName = `TikTok_Video_${Date.now()}.mp4`;
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const cardClass = isDarkTheme ? 'bg-dark text-white' : '';
            document.getElementById('result').innerHTML = `
                <div class="card mx-auto ${cardClass}" style="width: 18rem;">
                    <video controls class="card-img-top">
                        <source src="${video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <a href="${video}" class="btn btn-primary" download="${fileName}">Download Video</a>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('result').textContent = 'Error: No media found';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('result').textContent = 'Error downloading media';
    }
});

document.getElementById('pasteButton').addEventListener('click', function() {
    navigator.clipboard.readText()
        .then(text => document.getElementById('videoUrl').value = text)
        .catch(err => console.error('Failed to read clipboard contents: ', err));
});

document.getElementById('siteName').addEventListener('click', function() {
    location.reload();
});

document.getElementById('themeToggle').addEventListener('click', function() {
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const formControl = document.querySelectorAll('.form-control');
    const themeIcon = this.querySelector('i');

    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    navbar.classList.toggle('navbar-dark');
    navbar.classList.toggle('navbar-light');
    navbar.classList.toggle('bg-dark');
    navbar.classList.toggle('bg-light');
    
    formControl.forEach(input => {
        input.classList.toggle('light-theme');
        input.classList.toggle('dark-theme');
    });

    if (themeIcon.classList.contains('fa-sun')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});
