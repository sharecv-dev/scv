const itemsPerPage = 25000;
    let currentCustomerPage = 1;
    let currentApplicantPage = 1;
    let currentCollaboratorPage = 1;
    let customers = [];
    let applicants = [];
    let collaborators = [];

    function showContent(tab) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
      document.getElementById(tab + '-tab').classList.add('active');
      document.getElementById(tab).classList.add('active');
      if (tab === 'data') {
        showSubContent('data-customer');
      }
    }

    function showSubContent(subTab) {
      document.querySelectorAll('.data-container').forEach(container => container.style.display = 'none');
      document.getElementById(subTab).style.display = 'block';
      if (subTab === 'data-customer') {
        loadCustomers();
      } else if (subTab === 'data-applicant') {
        loadApplicants();
      } else if (subTab === 'data-collaborator') {
        loadCollaborators();
      }
      document.querySelectorAll('.sub-tab').forEach(tab => tab.classList.remove('active'));
      document.getElementById(subTab + '-tab').classList.add('active');
    }
    
    function toggleAllCheckboxes(type) {
      const checkboxes = document.querySelectorAll(`#${type}Table tbody tr:not(:first-child) td input[type="checkbox"]`);
      const selectAllCheckbox = document.getElementById(`selectAll${type.charAt(0).toUpperCase() + type.slice(1)}`);
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    }
    
    function deleteSelectedItems(type) {
      const checkboxes = document.querySelectorAll(`.${type}-checkbox:checked`);
      let indices = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index, 10));

      if (indices.length > 0) {
        if (confirm(`Bạn có chắc chắn muốn xóa ${indices.length} mục đã chọn không?`)) {
          indices.sort((a, b) => b - a);
          indices.forEach(index => {
            if (type === 'customer') {
              google.script.run.withSuccessHandler(loadCustomers).deleteCustomer(index);
            } else if (type === 'applicant') {
              google.script.run.withSuccessHandler(loadApplicants).deleteApplicant(index);
              } else if (type === 'collaborator') {
                google.script.run.withSuccessHandler(loadCollaborators).deleteCollaborator(index);
                }
          });
        }
      } else {
        alert('Vui lòng chọn ít nhất một mục để xóa.');
        }
    }

    function deleteAllRows(type) {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu không?')) {
        google.script.run.withSuccessHandler(function() {
          alert('Đã xóa toàn bộ dữ liệu.');
        }).deleteAllData(type);
      }
    }

    function loadCustomers() {
      google.script.run.withSuccessHandler(function(data) {
        customers = data;
        displayCustomerPage(currentCustomerPage);
      }).getCustomers();
    }

    function displayCustomerPage(page) {
      const customerList = document.getElementById('customerList');
      customerList.innerHTML = '';
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageCustomers = customers.slice(start, end);

      pageCustomers.forEach((customer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><input type="checkbox" class="customer-checkbox" data-index="${start + index}"></td>
                         <td>${customer.email}</td>`;
        customerList.appendChild(row);
      });

    }

    function loadApplicants() {
      google.script.run.withSuccessHandler(function(data) {
        applicants = data;
        displayApplicantPage(currentApplicantPage);
      }).getApplicants();
    }

    function displayApplicantPage(page) {
      const applicantList = document.getElementById('applicantList');
      applicantList.innerHTML = '';
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageApplicants = applicants.slice(start, end);

      pageApplicants.forEach((applicant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><input type="checkbox" class="applicant-checkbox" data-index="${start + index}"></td>
                         <td>${applicant.email}</td></td>`;
        applicantList.appendChild(row);
      });
    }

    function loadCollaborators() {
      google.script.run.withSuccessHandler(function(data) {
        collaborators = data;
        displayCollaboratorPage(currentCollaboratorPage);
      }).getCollaborators();
    }

    function displayCollaboratorPage(page) {
      const collaboratorList = document.getElementById('collaboratorList');
      collaboratorList.innerHTML = '';
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageCollaborators = collaborators.slice(start, end);

      pageCollaborators.forEach((collaborator, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><input type="checkbox" class="collaborator-checkbox" data-index="${start + index}"></td>
                         <td>${collaborator.email}</td>`;
        collaboratorList.appendChild(row);
      });
    }

    function showEditCustomerForm(index, email) {
      //
    }

    function showEditApplicantForm(index, email) {
      //
    }

    function showEditCollaboratorForm(index, email) {
      //
    }
    
    function searchCustomers() {
      const searchTerm = document.getElementById('customerSearch').value.trim().toLowerCase();
      const customerList = document.getElementById('customerList');
      customerList.innerHTML = '';
  
      customers.forEach((customer, index) => {
        if (customer.email.toLowerCase().includes(searchTerm)) {
          const row = document.createElement('tr');
          row.innerHTML = `<td><input type="checkbox" class="customer-checkbox" data-index="${index}"></td>
                           <td>${customer.email}</td>`;
          customerList.appendChild(row);
        }
      });
    }

    function searchApplicants() {
      const searchTerm = document.getElementById('applicantSearch').value.trim().toLowerCase();
      const applicantList = document.getElementById('applicantList');
      applicantList.innerHTML = '';

      applicants.forEach((applicant, index) => {
        if (applicant.email.toLowerCase().includes(searchTerm)) {
          const row = document.createElement('tr');
          row.innerHTML = `<td><input type="checkbox" class="applicant-checkbox" data-index="${index}"></td>
                           <td>${applicant.email}</td>`;
          applicantList.appendChild(row);
        }
      });
    }

    function searchCollaborators() {
      const searchTerm = document.getElementById('collaboratorSearch').value.trim().toLowerCase();
      const collaboratorList = document.getElementById('collaboratorList');
      collaboratorList.innerHTML = '';

      collaborators.forEach((collaborator, index) => {
        if (collaborator.email.toLowerCase().includes(searchTerm)) {
          const row = document.createElement('tr');
          row.innerHTML = `<td><input type="checkbox" class="collaborator-checkbox" data-index="${index}"></td>
                           <td>${collaborator.email}</td>`;
          collaboratorList.appendChild(row);
        }
      });
    }

    function addEmail() {
      const type = document.getElementById('addType').value;
      const newEmail = document.getElementById('newEmail').value.trim();
      
      if (newEmail) {
        if (type === 'customer') {
          google.script.run.withSuccessHandler(loadCustomers).addCustomer(newEmail);
        } else if (type === 'applicant') {
          google.script.run.withSuccessHandler(loadApplicants).addApplicant(newEmail);
        } else if (type == 'collaborator') {
          google.script.run.withSuccessHandler(loadCollaborators).addCollaborator(newEmail);
        }

        document.getElementById('newEmail').value = '';
      }
    }

    function sendEmail() {
      const subject = document.getElementById('subject').value;
      const htmlBody = getHtmlFromTemplate('form.html');
      const sendToType = document.getElementById('sendToType').value;
      
      let recipients = [];
      
      if (sendToType === 'customer') {
        recipients = customers.map(customer => customer.email);
        } else if (sendToType === 'applicant') {
          recipients = applicants.map(applicant => applicant.email);
          } else if (sendToType === 'collaborator') {
            recipients = collaborators.map(collaborator => collaborator.email);
            }
                       
            google.script.run
            .withSuccessHandler(
                () =>{
                  recipients.value = "";
                  document.querySelectorAll('.multi').forEach(function(el) {el.recipients = false;});
                Swal.fire({title:"", text:'Email đã được gửi thành công!', icon:'success', timer: 2000, showConfirmButton:false}); 
              }
          )
            .sendEmails(subject, '', htmlBody, recipients);

            document.getElementById('subject').value = '';
            document.getElementById('htmlBody').value = '';
    }

    function getHtmlFromTemplate(templateFile) {
      var template = HtmlService.createTemplateFromFile(templateFile);
      var htmlBody = template.evaluate().getContent();
      return htmlBody;
    }