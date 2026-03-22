const API = "https://script.google.com/macros/s/AKfycbxwUSZX6XCJytfqECWqsXxBxVDzA-iJ7HtaXtKby8Ma9YfPdtrZ3q3UiOLlTY00oukf/exec";

// Helper function for showing notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Helper function for showing loading state
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.textContent = 'Loading...';
    button.style.opacity = '0.6';
  } else {
    button.disabled = false;
    button.textContent = button.getAttribute('data-original-text') || 'Submit';
    button.style.opacity = '1';
  }
}

function register(){
  const button = event.target;
  button.setAttribute('data-original-text', button.textContent);
  
  // Validation
  if (!name.value || !email.value || !password.value || !department.value || !year.value || !contact.value) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  
  if (password.value.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }
  
  setLoading(button, true);
  
  fetch(API,{
    method:"POST",
    body:new URLSearchParams({
      action:"register",
      role:role.value,
      name:name.value,
      department:department.value,
      year:year.value,
      contact:contact.value,
      email:email.value,
      password:password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    setLoading(button, false);
    if (data.status === 'success') {
      showNotification('Registration successful! Redirecting...', 'success');
      setTimeout(() => window.location = 'login.html', 1500);
    } else {
      showNotification(data.message || 'Registration failed', 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Error: ' + error.message, 'error');
  });
}

function login(){
  const button = event.target;
  button.setAttribute('data-original-text', button.textContent);
  
  // Validation
  if (!email.value || !password.value) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  
  setLoading(button, true);
  
  fetch(API,{
    method:"POST",
    body:new URLSearchParams({
      action:"login",
      email:email.value,
      password:password.value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    setLoading(button, false);
    if(data.status=="success"){
      localStorage.setItem("userID", data.userID);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      showNotification('Login successful!', 'success');
      if(data.role=="Student"){
        window.location="dashboard_student.html";
      }else{
        window.location="dashboard_ci.html";
      }
    }else{
      showNotification(data.message || "Invalid login", 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Error: ' + error.message, 'error');
  });
}

localStorage.setItem("userID", data.id);

function logout() {
  localStorage.clear();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => window.location = 'login.html', 1000);
}
