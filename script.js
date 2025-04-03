// Add event listener to the new post form
const newPostForm = document.getElementById('new-post-form');
if (newPostForm) {
    newPostForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const title = document.getElementById('title').value.trim(); // Get form values
        const content = document.getElementById('content').value.trim(); // Get form values
        const image = document.getElementById('image').value.trim(); // Get form values

        if (!title || !content) { // Validate inputs
            alert('Title and content are required!');
            return;
        }

        const newPost = { // Create a new post object
            id: Date.now(), // Unique ID based on timestamp
            title,
            content,
            image,
        };

        const posts = JSON.parse(localStorage.getItem('blogPosts')) || []; // Get existing posts from local storage
        posts.push(newPost); // Add the new post to the array
        localStorage.setItem('blogPosts', JSON.stringify(posts)); // Save the updated posts array back to local storage

        window.location.href = 'index.html'; // Redirect to the homepage
    });
}

// Function to load posts on the homepage
function loadPosts() {
    // Fetch posts from local storage
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postList = document.getElementById('post-list');

    // Clear the list
    postList.innerHTML = '';

    // Check if there are any posts
    if (posts.length === 0) {
        postList.innerHTML = '<p>No blog posts available. Create one!</p>';
        return;
    }

    // Add each post to the list
    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 100)}...</p>
            <a href="post.html?id=${post.id}">Edit Post</a>
        `;
        postList.appendChild(listItem);
    });
}

// Call loadPosts if on the homepage
if (document.getElementById('post-list')) {
    loadPosts();
}

// Get the post ID from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Fetch posts from local storage
const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
const post = posts.find(p => p.id == postId);

if (post) {
    // Display post details
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    const postImage = document.getElementById('post-image');

    if (postTitle) postTitle.textContent = post.title;
    if (postContent) postContent.textContent = post.content;
    if (postImage && post.image) {
        postImage.src = post.image;
        postImage.style.display = 'block';
    }

    // Handle "Edit Post" button click
    const editPostButton = document.getElementById('edit-post');
    if (editPostButton) {
        editPostButton.addEventListener('click', () => {
            document.getElementById('post-details').style.display = 'none';
            document.getElementById('edit-section').style.display = 'block';

            // Pre-fill the form with existing post data
            document.getElementById('edit-title').value = post.title;
            document.getElementById('edit-content').value = post.content;
        });
    }

    // Handle "Save Changes" form submission
    const editPostForm = document.getElementById('edit-post-form');
    if (editPostForm) {
        editPostForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Update post data
            post.title = document.getElementById('edit-title').value.trim();
            post.content = document.getElementById('edit-content').value.trim();

            // Save updated posts back to local storage
            localStorage.setItem('blogPosts', JSON.stringify(posts));

            // Redirect to homepage
            alert('Post updated successfully!');
            window.location.href = 'index.html';
        });
    }

    // Handle "Delete Post" button click
    const deletePostButton = document.getElementById('delete-post');
    if (deletePostButton) {
        deletePostButton.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this post?');
            if (confirmDelete) {
                // Remove the post from the array
                const updatedPosts = posts.filter(p => p.id != postId);

                // Save the updated posts back to local storage
                localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

                // Redirect to the homepage
                alert('Post deleted successfully!');
                window.location.href = 'index.html';
            }
        });
    }
} else {
    alert('Post not found!');
    window.location.href = 'index.html';
}