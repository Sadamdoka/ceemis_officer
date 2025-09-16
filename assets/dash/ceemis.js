//Removing Preloader
setTimeout(function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader-hide');
    }
}, 150);

document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    //Place all your custom Javascript functions and plugin calls below this line
    function Init() {
        document.getElementById('loader-style').style.display = 'none';
        document.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click
        //document.addEventListener('copy', (e) => e.preventDefault());        // Disable copy
        //document.addEventListener('paste', (e) => e.preventDefault());       // Disable paste
        //document.addEventListener('cut', (e) => e.preventDefault());
        //Caching Global Variables


        //General ACTIONS
        function sessionManager() {
            /// Retrieve user data from sessionStorage
            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = storedUserDataString ? JSON.parse(storedUserDataString) : null;


            // Check if user data exists
            if (!storedUserData) {
                // Redirect to login page if not logged in
                //window.location.href = 'index.html';
            } else {
                window.location.href = 'home.html';
            }

        }

        function InitIndex() {
            console.log('Initializing Index');


            sessionManager();

            document.getElementById('authe').addEventListener('click', signin, false);
            function signin() {
                event.preventDefault();
                let email = document.getElementById("email").value;
                let pass = document.getElementById("pass").value;
                login(email, pass);
            }



        }

        function InitHome() {
            console.log('Initializing Home');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            //console.log(storedUserData);


            loadCategory('hcategory');

            getLocation();

            const recordAudioCheck = document.getElementById('recordAudioCheck');
            const audioControls = document.getElementById('audioControls');
            const audioPlayback = document.getElementById('audioPlayback');

            recordAudioCheck.addEventListener('change', () => {
                audioControls.style.display = recordAudioCheck.checked ? 'block' : 'none';
            });

            let mediaRecorder;
            let audioChunks = [];
            let recordedAudioFile = null;

            // Start recording
            document.getElementById('startRecording').addEventListener('click', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true});
                mediaRecorder = new MediaRecorder(stream);

                audioChunks = [];
                mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, {type: 'audio/mp3'});
                    recordedAudioFile = new File([audioBlob], "recording.mp3", {type: 'audio/mp3'});

                    // Show playback
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    audioPlayback.style.display = 'block';
                };

                mediaRecorder.start();
                document.getElementById('startRecording').disabled = true;
                document.getElementById('stopRecording').disabled = false;
            });

            // Stop recording
            document.getElementById('stopRecording').addEventListener('click', () => {
                mediaRecorder.stop();
                document.getElementById('startRecording').disabled = false;
                document.getElementById('stopRecording').disabled = true;
            });




            document.getElementById('btn_report').addEventListener('click', reportNormal);
            function reportNormal(event) {
                event.preventDefault();
                console.log('Normal');
                let cat = document.getElementById("hcategory").value;
                let nara = document.getElementById("hnaration").value;


                const audioFile = document.getElementById('recordAudioCheck').checked ? recordedAudioFile : null;
                // Check if audio is required but not recorded
                if (document.getElementById('recordAudioCheck').checked && !audioFile) {
                    showMessage('Alert', "Please Record Voicenote or Uncheck to Continue!", 'warning');
                    return; // Stop submission
                }

                internalCaseReport("0", storedUserData.names, storedUserData.phone, storedUserData.email, storedUserData.passport, storedUserData.userid, storedUserData.jobtype, storedUserData.lcompany, storedUserData.fcompany, getLatitude(), getLongitude(), getAddressName(), nara, cat);

                // Only attach audio if it exists
                if (audioFile) {
                    const caseid = sessionStorage.getItem('cid');
                    if (!caseid) {
                        showMessage('Alert', "Missing Case Ticket ID", 'warning');
                        return;
                    }
                    addAudio(caseid, "Audio Attachment", audioFile);
                }

            }

        }

        function InitReg() {
            console.log('Initializing Register');
            document.getElementById('btn_check').addEventListener('click', checkBtn, false);
            function checkBtn() {
                event.preventDefault();
                let nin = document.getElementById("nin").value;
                check(nin);
            }

            document.getElementById('btn_reg').addEventListener('click', reg, false);
            function reg() {
                event.preventDefault();
                if ($('#flexCheckDefault-1').is(':checked')) {
                    let nin = document.getElementById("nin").value;
                    let name = document.getElementById("names").value;
                    let address = document.getElementById("address").value;
                    let email = document.getElementById("email").value;
                    let phone = document.getElementById("tel").value;
                    let gender = document.getElementById("gender").value;
                    let dob = document.getElementById("dob").value;
                    let job = document.getElementById("job").value;
                    registerMW(checkInput(name), checkInput(nin), checkInput(address), checkInput(email), checkInput(phone), checkInput(gender), checkInput(dob), checkInput(job));
                } else {
                    showMessage('Alert!', "Please agree Terms of Use.", 'warning');

                }

            }

        }

        function InitGuest() {
            console.log('Initializing Guest');
            loadCategory();
            populateCountrySelect("mw_country");
            loadCategory('mw_comp_category');

            document.getElementById('btn_check_guest').addEventListener('click', checkBtn, false);
            function checkBtn() {
                event.preventDefault();
                let nin = document.getElementById("nin").value;
                getMw(nin);
            }

            document.getElementById('mw_country').addEventListener('change', city, false);
            function city(event) {
                event.preventDefault();
                loadCity();
            }



            document.getElementById('report_btn').addEventListener('click', reportCase);
            function reportCase(event) {
                event.preventDefault();
                document.getElementById("report_btn").disabled = true;
                var check = document.getElementById('info_check');
                var pp_status = document.getElementById('nin');

                if (check.checked) {
                    if (pp_status === "Unknown") {
                        addMigrantWorker();
                    } else {
                        getMWCheck();
                    }
                } else {
                    alert("Agree to the Declaration Please");
                }

            }
        }

        function InitReport() {
            console.log('Initializing Report Case');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            console.log(storedUserData);

        }

        function InitCase() {
            console.log('Initializing My Cases');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            // console.log(storedUserData);

            getCase('div_case');

            // Grab the form and input
            const searchForm = document.querySelector(".search-form");
            const searchInput = document.getElementById("searchInput");

            // Prevent form from submitting (page reload) when Enter is pressed
            searchForm.addEventListener("submit", function (event) {
                event.preventDefault(); // stop default form submission
            });

            // Live search/filter as user types
            searchInput.addEventListener("input", function () {

                const query = this.value.toLowerCase();
                const cards = document.querySelectorAll("#div_case .accordion-item");

                //console.log(cards);

                cards.forEach(card => {
                    const caseBtn = card.querySelector(".accordion-button");
                    const categoryEl = card.querySelector(".accordion-body h3");
                    const assistanceEl = card.querySelector(".accordion-body h6");
                    const locationEl = card.querySelector(".accordion-body p");

                    const caseId = caseBtn ? caseBtn.textContent.toLowerCase() : "";
                    const category = categoryEl ? categoryEl.textContent.toLowerCase() : "";
                    const assistance = assistanceEl ? assistanceEl.textContent.toLowerCase() : "";
                    const location = locationEl ? locationEl.textContent.toLowerCase() : "";

                    if (caseId.includes(query) || category.includes(query) || assistance.includes(query) || location.includes(query)) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            });



            // Attach event listener after rendering
            document.addEventListener("click", function (e) {
                if (e.target.classList.contains("case-status-btn")) {
                    const caseId = e.target.getAttribute("data-case-id");
                    document.getElementById("case_id").value = caseId;
                    loadMsg(caseId);
                }
            });


            // Attach event listener after rendering
            document.addEventListener("click", function (e) {
                if (e.target.classList.contains("case-activity-btn")) {
                    const caseId = e.target.getAttribute("data-case-id");
                    document.getElementById("case_id").value = caseId;
                    loadLogsTimelime(caseId, 'timeline');
                }
            });


            document.getElementById('chat_btn_send').addEventListener('click', sendMSG, false);
            function sendMSG(event) {
                event.preventDefault();

                let msgtext = document.getElementById("messageInput").value;
                let caseid = document.getElementById("case_id").value;

                //console.log(caseid);

                caseChatMsg(caseid, storedUserData.userid, msgtext, "NA", storedUserData.names, "0");
            }


        }

        function InitMap() {
            console.log('Initializing Map');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            //console.log(storedUserData);

            getWorkersAndAmnesty('div_map');
            //getWorker('elm');

        }

        function InitEmno() {
            console.log('Initializing Emergency Numbers');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            //console.log(storedUserData);

            getEm_numbers('div_emno');

        }


        function InitAbout() {
            console.log('Initializing About');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            //console.log(storedUserData);

        }

        function InitProfile() {
            console.log('Initializing Profile');

            const storedUserDataString = localStorage.getItem('officerData');
            const storedUserData = JSON.parse(storedUserDataString);

            console.log(storedUserData);


            $('#puserid').text(storedUserData.resid);
            $('#pname').val(storedUserData.name);
            $('#ptel').val(storedUserData.phone);
            $('#pemail').val(storedUserData.email);

        }

        // Function to detect the current page based on the URL or other markers
        function getCurrentPage() {
            const path = window.location.pathname;
            if (path.includes('index.html')) {
                return 'index';
            } else if (path.includes('home.html')) {
                return 'home';
            } else if (path.includes('register.html')) {
                return 'register';
            } else if (path.includes('guest.html')) {
                return 'guest';
            } else if (path.includes('report.html')) {
                return 'report';
            } else if (path.includes('mycase.html')) {
                return 'mycase';
            } else if (path.includes('map.html')) {
                return 'map';
            } else if (path.includes('em_number.html')) {
                return 'em_number';
            } else if (path.includes('about.html')) {
                return 'about';
            } else if (path.includes('profile.html')) {
                return 'profile';
            } else {
                location.href = 'index.html';
                return 'index'; // default case or homepage
            }
        }

        // Load specific JavaScript for each page
        function loadPageScripts() {
            const currentPage = getCurrentPage();
            switch (currentPage) {
                case 'index':
                    InitIndex();
                    break;
                case 'home':
                    InitHome();
                    break;
                case 'register':
                    InitReg();
                    break;
                case 'guest':
                    InitGuest();
                    break;
                case 'report':
                    InitReport();
                    break;
                case 'mycase':
                    InitCase();
                    break;
                case 'map':
                    InitMap();
                    break;
                case 'em_number':
                    InitEmno();
                    break;
                case 'about':
                    InitAbout();
                    break;
                case 'profile':
                    InitProfile();
                    break;
                default:
                    //sessionEmpty();
                    break;
            }
        }

        //location Manager
        let currentLat = null;
        let currentLon = null;
        let currentAddress = null;

        // Request user location
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function success(position) {
            currentLat = position.coords.latitude;
            currentLon = position.coords.longitude;
            //document.getElementById("coords").innerText = `Lat: ${currentLat}, Lon: ${currentLon}`;

            // Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${currentLat}&lon=${currentLon}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        currentAddress = data.display_name;
                        //document.getElementById("address").innerText = currentAddress;
                    })
                    .catch(err => console.error(err));
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            alert("Unable to retrieve location.");
        }

        // Reusable methods

        function getLatitude() {
            if (currentLat !== null)
                return currentLat;
            alert("Latitude not available. Call getLocation() first.");
            return null;
        }

        function getLongitude() {
            if (currentLon !== null)
                return currentLon;
            alert("Longitude not available. Call getLocation() first.");
            return null;
        }

        function getAddressName() {
            if (currentAddress !== null)
                return currentAddress;
            alert("Address not available. Call getLocation() first.");
            return null;
        }

        function logout(event) {
            event.preventDefault(); // stop immediate navigation
            sessionStorage.clear(); // clear session storage
            window.location.href = "index.html"; // redirect after clearing
        }


        function showMessage(title, text, icon = 'success') {
            Swal.fire({
                title: title,
                text: text,
                icon: icon, // 'success', 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK',
                customClass: 'beauty-swal'
            });
        }



        function showProgress() {
            // Show spinner before AJAX call
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your request.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }


        // Reusable method to check a string value
        function checkInput(value) {
            if (!value || !value.trim()) {
                return "NA";
            }
            return value;
        }





        function login(email, pass) {
            var form = new FormData();
            form.append('email', email);
            form.append('password', pass);

            // Show spinner before AJAX call
            showProgress();

            var settings = {
                "url": sessionStorage.getItem('url') + "conditions/user_ceemis",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };


            $.ajax(settings).done(function (response) {
                const obj = JSON.parse(response);
                //console.log(obj.error_msg);
                if (obj.status === true) {
                    //sessionStorage.setItem('userid', response.err_msg);
                    getInfo(email);
                } else {
                    showMessage('Alert!', obj.error_msg, 'warning');
                    // alert(response.msg);
                }
            });
        }


        function check(nin) {
            var form = new FormData();
            form.append("nin", nin);

            showProgress();

            var settings = {
                "url": sessionStorage.getItem('url') + "conditions/worker",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };


            $.ajax(settings).done(function (response) {
                const obj = JSON.parse(response);
                if (obj.status === true) {
                    //sessionStorage.setItem('userid', response.err_msg);
                    //location.href = 'home.html';
                    showMessage('Alert!', "This Passport No | Nin No. is already registered,Please proceed to login.", 'success');
                } else {
                    showMessage('Alert!', "Not Registered, Please fill in the rest of information to create Account", 'warning');
                }
            });
        }



        function registerMW(name, pass, address, email, phone, gender, dob, job) {
            var form = new FormData();
            form.append("name", name);
            form.append("pass", pass);
            form.append("address", address);
            form.append("email", email);
            form.append("phone", phone);
            form.append("gender", gender);
            form.append("dob", dob);
            form.append("jobtype", job);
            form.append("lcompany", "NA");
            form.append("fcompany", "NA");
            form.append("lati", "NA");
            form.append("longi", "NA");
            form.append("cty", "UG");

            showProgress();

            var settings = {
                "url": sessionStorage.getItem('url') + "create/guest",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                const obj = JSON.parse(response);
                if (obj.status === true) {
                    showMessage('Alert!', "Account Created,Proceed to Login", 'success');
                    location.href = 'index.html';
                } else {
                    showMessage('Error', "While Creating Account,Please try again", 'error');
                }
            });

        }


        function loadCategory(elm) {
            try {
                $.ajax({
//
                    url: url + "fetch/category",
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    // timeout:3000, //3 second timeout 
                    processData: false,
                    contentType: false,
                    beforeSend: function () {               //tbody.html("<tr><td colspan='5' align='center'><i class = 'fa fa-spinner spin'></i> Loading</td></tr>");
                        $("#" + elm).html('<tr><td colspan="8" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td></tr>');
                    },
                    complete: function (data) {
                        //tbody.html("<i class = 'fa fa-spinner spin'></i> Please Wait.."+ JSON.stringify(data));
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            $("#" + elm).empty();
                            let i = 1;
                            let row = "";
                            if (!isEmpty(data)) {
                                //console.log(data);
                                row += "";
                                var value = data.category;
                                if (!isJsonArray(value)) {
                                    //console.log(value.id);

                                    e_data += '<option id="' + value.id + '" name="' + value.description + '" ">';
                                    e_data += value.name;
                                    e_data += '</option>';

                                } else {
                                    $.each(data.category, function (index, value) {
                                        //console.log(value);

                                        e_data += '<option id="' + value.id + '" name="' + value.description + '" ">';
                                        e_data += value.name;
                                        e_data += '</option>';
                                        ++i;
                                    });
                                }
                            } else {
                                row += '<tr><td colspan="8" align="center">No data</td></tr>';
                            }
                            $("#" + elm).append(e_data);
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');

                        }
                    },
                    error: function (d) {

                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }

        function getMw(input) {
            try {
                $.ajax({
                    url: url + "fetch/workers/" + input,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        //reset container
                    },
                    complete: function (data) {
                        //upon completion
                        //alert("Finished Loading");
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            //$("#logs").empty();
                            let row = "";
                            let i = 1;
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.user_worker;
                                //above must be customised
                                if (!isJsonArray(jdata)) {
                                    //Add Singular values
                                    //var value = jdata;
                                    //console.log(jdata.names);
                                    var nam = jdata.names;
                                    const myArray = nam.split(" ");
                                    let fname = myArray[0];
                                    let sname = myArray[1];
                                    let mname = myArray[2];
                                    //console.log(checkVAR(fname));
                                    //console.log(checkVAR(sname));
                                    // console.log(checkVAR(mname));


                                    document.getElementById('mw_userid').value = jdata.userid;
                                    document.getElementById('mw_name_f').value = checkInput(fname); //mw_name_m ,mw_name_s
                                    document.getElementById('mw_name_s').value = checkInput(sname); //mw_name_m ,mw_name_s
                                    document.getElementById('mw_name_m').value = checkInput(mname); //mw_name_m ,mw_name_s
                                    //document.getElementById('mw_id_user').innerHTML = jdata.userid;
                                    document.getElementById('mw_whatsapp_no').value = jdata.phone;
                                    //document.getElementById('mw_passport').value = jdata.passport;
                                    //document.getElementsByName('mw_lorg').value = jdata.userid;
                                    //document.getElementsByName('mw_forg').value = jdata.userid;
                                    //setOrgan(jdata.lcompany, 'mw_lco');
                                    //setOrgan(jdata.fcompany, 'mw_fco');
                                    loadOrgan('UG', 'mw_lco', "<option  disabled selected hidden >Choose Ugandan/Sending Recruitment Agency</option>");
                                    loadOrgan('SA', 'mw_fco', "<option  disabled selected hidden >Choose Saudi/Receiving Recruitment Agency</option>");

                                    //console.log(document.getElementById("mw_lco"));
                                    //console.log(document.getElementById("mw_fco"));

                                    //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                } else {
                                    //Add ArrayList
                                    //above must be customised
                                    $.each(data.user_worker, function (index, value) {
                                        alert("Error while loading user data");
                                        //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                        //++i;
                                    });
                                }
                            } else {
                                //console.log("Your Not Registered With US");

                                showMessage('Alert!', 'If Passport Number is correct, please proceed to fill the rest of the form!', 'warning');
                                loadOrgan('UG', 'mw_lco', "<option  disabled selected hidden >Choose Ugandan/Sending Recruitment Agency</option>");
                                loadOrgan('SA', 'mw_fco', "<option  disabled selected hidden >Choose Saudi/Receiving Recruitment Agency</option>");
                            }
                            //appending data
                            //$("#logs").append(e_data);
                        } catch (e) {

                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }});
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }



        function setOrgan(input, elem) {
            try {
                $.ajax({
//
                    url: url + "fetch/organ/0/" + input,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    // timeout:3000, //3 second timeout 
                    processData: false,
                    contentType: false,
                    beforeSend: function () {               //tbody.html("<tr><td colspan='5' align='center'><i class = 'fa fa-spinner spin'></i> Loading</td></tr>");
                        // $("#prop_body").html('<tr><td colspan="5" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td></tr>');

                    },
                    complete: function (data) {
                        //tbody.html("<i class = 'fa fa-spinner spin'></i> Please Wait.."+ JSON.stringify(data));
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            $("#" + elem).empty();
                            let i = 1;
                            let row = "";
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.organ;
                                if (!isJsonArray(jdata)) {
                                    //console.log(jdata.id);
                                    e_data += '<option id="' + jdata.organid + '" ma="' + jdata.email + '" name="' + jdata.phone + '" ">';
                                    e_data += jdata.names;
                                    e_data += '</option>';
                                } else {
                                    $.each(data.organ, function (index, value) {
                                        //console.log(value.id);
                                        e_data += '<option id="' + jdata.organid + '" ma="' + jdata.email + '" name="' + jdata.phone + '" ">';
                                        e_data += jdata.names;
                                        e_data += '</option>';
                                        ++i;
                                    });
                                }
                            } else {
                                row += '<tr><td colspan="5" align="center">No data</td></tr>';
                            }
                            //$("#" + elem).append(opt);
                            $("#" + elem).append(e_data);
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }




        const countryMap = {
            "AF": "Afghanistan",
            "AL": "Albania",
            "DZ": "Algeria",
            "AD": "Andorra",
            "AO": "Angola",
            "AG": "Antigua and Barbuda",
            "AR": "Argentina",
            "AM": "Armenia",
            "AU": "Australia",
            "AT": "Austria",
            "AZ": "Azerbaijan",
            "BS": "Bahamas",
            "BH": "Bahrain",
            "BD": "Bangladesh",
            "BB": "Barbados",
            "BY": "Belarus",
            "BE": "Belgium",
            "BZ": "Belize",
            "BJ": "Benin",
            "BT": "Bhutan",
            "BO": "Bolivia",
            "BA": "Bosnia and Herzegovina",
            "BW": "Botswana",
            "BR": "Brazil",
            "BN": "Brunei",
            "BG": "Bulgaria",
            "BF": "Burkina Faso",
            "BI": "Burundi",
            "KH": "Cambodia",
            "CM": "Cameroon",
            "CA": "Canada",
            "CV": "Cape Verde",
            "CF": "Central African Republic",
            "TD": "Chad",
            "CL": "Chile",
            "CN": "China",
            "CO": "Colombia",
            "KM": "Comoros",
            "CG": "Congo (Congo-Brazzaville)",
            "CD": "Congo (DRC)",
            "CR": "Costa Rica",
            "HR": "Croatia",
            "CU": "Cuba",
            "CY": "Cyprus",
            "CZ": "Czechia (Czech Republic)",
            "DK": "Denmark",
            "DJ": "Djibouti",
            "DM": "Dominica",
            "DO": "Dominican Republic",
            "EC": "Ecuador",
            "EG": "Egypt",
            "SV": "El Salvador",
            "GQ": "Equatorial Guinea",
            "ER": "Eritrea",
            "EE": "Estonia",
            "SZ": "Eswatini (Swaziland)",
            "ET": "Ethiopia",
            "FJ": "Fiji",
            "FI": "Finland",
            "FR": "France",
            "GA": "Gabon",
            "GM": "Gambia",
            "GE": "Georgia",
            "DE": "Germany",
            "GH": "Ghana",
            "GR": "Greece",
            "GD": "Grenada",
            "GT": "Guatemala",
            "GN": "Guinea",
            "GW": "Guinea-Bissau",
            "GY": "Guyana",
            "HT": "Haiti",
            "HN": "Honduras",
            "HU": "Hungary",
            "IS": "Iceland",
            "IN": "India",
            "ID": "Indonesia",
            "IR": "Iran",
            "IQ": "Iraq",
            "IE": "Ireland",
            "IL": "Israel",
            "IT": "Italy",
            "JM": "Jamaica",
            "JP": "Japan",
            "JO": "Jordan",
            "KZ": "Kazakhstan",
            "KE": "Kenya",
            "KI": "Kiribati",
            "KW": "Kuwait",
            "KG": "Kyrgyzstan",
            "LA": "Laos",
            "LV": "Latvia",
            "LB": "Lebanon",
            "LS": "Lesotho",
            "LR": "Liberia",
            "LY": "Libya",
            "LI": "Liechtenstein",
            "LT": "Lithuania",
            "LU": "Luxembourg",
            "MG": "Madagascar",
            "MW": "Malawi",
            "MY": "Malaysia",
            "MV": "Maldives",
            "ML": "Mali",
            "MT": "Malta",
            "MH": "Marshall Islands",
            "MR": "Mauritania",
            "MU": "Mauritius",
            "MX": "Mexico",
            "FM": "Micronesia",
            "MD": "Moldova",
            "MC": "Monaco",
            "MN": "Mongolia",
            "ME": "Montenegro",
            "MA": "Morocco",
            "MZ": "Mozambique",
            "MM": "Myanmar (Burma)",
            "NA": "Namibia",
            "NR": "Nauru",
            "NP": "Nepal",
            "NL": "Netherlands",
            "NZ": "New Zealand",
            "NI": "Nicaragua",
            "NE": "Niger",
            "NG": "Nigeria",
            "KP": "North Korea",
            "MK": "North Macedonia",
            "NO": "Norway",
            "OM": "Oman",
            "PK": "Pakistan",
            "PW": "Palau",
            "PS": "Palestine",
            "PA": "Panama",
            "PG": "Papua New Guinea",
            "PY": "Paraguay",
            "PE": "Peru",
            "PH": "Philippines",
            "PL": "Poland",
            "PT": "Portugal",
            "QA": "Qatar",
            "RO": "Romania",
            "RU": "Russia",
            "RW": "Rwanda",
            "KN": "Saint Kitts and Nevis",
            "LC": "Saint Lucia",
            "VC": "Saint Vincent and the Grenadines",
            "WS": "Samoa",
            "SM": "San Marino",
            "ST": "Sao Tome and Principe",
            "SA": "Saudi Arabia",
            "SN": "Senegal",
            "RS": "Serbia",
            "SC": "Seychelles",
            "SL": "Sierra Leone",
            "SG": "Singapore",
            "SK": "Slovakia",
            "SI": "Slovenia",
            "SB": "Solomon Islands",
            "SO": "Somalia",
            "ZA": "South Africa",
            "KR": "South Korea",
            "SS": "South Sudan",
            "ES": "Spain",
            "LK": "Sri Lanka",
            "SD": "Sudan",
            "SR": "Suriname",
            "SE": "Sweden",
            "CH": "Switzerland",
            "SY": "Syria",
            "TJ": "Tajikistan",
            "TZ": "Tanzania",
            "TH": "Thailand",
            "TL": "Timor-Leste",
            "TG": "Togo",
            "TO": "Tonga",
            "TT": "Trinidad and Tobago",
            "TN": "Tunisia",
            "TR": "Turkey",
            "TM": "Turkmenistan",
            "TV": "Tuvalu",
            "UG": "Uganda",
            "UA": "Ukraine",
            "AE": "United Arab Emirates",
            "GB": "United Kingdom",
            "US": "United States",
            "UY": "Uruguay",
            "UZ": "Uzbekistan",
            "VU": "Vanuatu",
            "VA": "Vatican City",
            "VE": "Venezuela",
            "VN": "Vietnam",
            "YE": "Yemen",
            "ZM": "Zambia",
            "ZW": "Zimbabwe"
        };

// Populate the dropdown
        function populateCountrySelect(elm) {
            const select = document.getElementById(elm);

            for (const isoCode in countryMap) {
                const option = document.createElement("option");
                option.id = isoCode; // Set ISO 2 code as the ID
                option.value = isoCode; // ISO 2 country code
                option.textContent = countryMap[isoCode]; // Full country name
                select.appendChild(option);
            }
        }

        function loadOrgan(input, elem, opt) {
            try {
                $.ajax({
//
                    url: url + "fetch/organs_cty_bi/" + input,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    // timeout:3000, //3 second timeout 
                    processData: false,
                    contentType: false,
                    beforeSend: function () {               //tbody.html("<tr><td colspan='5' align='center'><i class = 'fa fa-spinner spin'></i> Loading</td></tr>");
                        // $("#prop_body").html('<tr><td colspan="5" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td></tr>');

                    },
                    complete: function (data) {
                        //tbody.html("<i class = 'fa fa-spinner spin'></i> Please Wait.."+ JSON.stringify(data));
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            $("#" + elem).empty();
                            let i = 1;
                            let row = "";
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.organ;
                                if (!isJsonArray(jdata)) {
                                    //console.log(jdata.id);
                                    e_data += '<option id="' + jdata.organid + '" ma="' + jdata.email + '" name="' + jdata.phone + '" ">';
                                    e_data += jdata.names;
                                    e_data += '</option>';
                                } else {
                                    $.each(data.organ, function (index, value) {
                                        //console.log(value.id);
                                        e_data += '<option id="' + value.organid + '" ma="' + value.email + '" name="' + value.phone + '" ">';
                                        e_data += value.names;
                                        e_data += '</option>';
                                        ++i;
                                    });
                                }
                            } else {
                                row += '<tr><td colspan="5" align="center">No data</td></tr>';
                            }
                            //$("#" + elem).append(opt);
                            $("#" + elem).append(e_data);
                            //console.log(e_data);
                            //setSearch(elem);
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }

        function loadCity() {
            let id = $("#mw_country :selected").attr('id');
            //id = ""
            //console.log(id);

            loadOrgan('UG', 'mw_lco', "<option  disabled selected hidden >Sending Recruitment Agency</option>");
            loadOrgan(id, 'mw_fco', "<option  disabled selected hidden >Receiving Recruitment Agency</option>");
            try {
                $.ajax({
//
                    url: url + "fetch/city/0/" + id + "/null",
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    // timeout:3000, //3 second timeout 
                    processData: false,
                    contentType: false,
                    beforeSend: function () {               //tbody.html("<tr><td colspan='5' align='center'><i class = 'fa fa-spinner spin'></i> Loading</td></tr>");
                        $("#mw_address").html('<tr><td colspan="8" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td></tr>');
                    },
                    complete: function (data) {
                        //tbody.html("<i class = 'fa fa-spinner spin'></i> Please Wait.."+ JSON.stringify(data));
                    },
                    success: function (data) {
                        var e_data = '';
                        try {

                            //setSearch('mw_address');
                            $("#mw_address").empty();
                            let i = 1;
                            let row = "";
                            if (!isEmpty(data)) {
                                row += "";
                                var value = data.city;
                                if (!isJsonArray(value)) {
                                    //console.log(value.id);
                                    e_data += '<option id="' + value.id + '" ">';
                                    e_data += value.name;
                                    e_data += '</option>';
                                } else {
                                    $.each(data.city, function (index, value) {
                                        e_data += '<option id="' + value.id + '" ">';
                                        e_data += value.name;
                                        e_data += '</option>';
                                        ++i;
                                    });
                                }
                            } else {
                                row += '<tr><td colspan="8" align="center">No data</td></tr>';
                            }
                            $("#mw_address").append("<option disabled selected hidden>Choose MW Address</option>");
                            $("#mw_address").append(e_data);
                            //$('mw_address').selectpicker('refresh');
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }



        function addMigrantWorker() {

            let sname = document.getElementById("mw_name_s").value;
            let fname = document.getElementById("mw_name_f").value;
            let mname = document.getElementById("mw_name_m").value;
            let name = sname + " " + fname + " " + mname;
            let pass = document.getElementById("nin").value;
            let address = document.getElementById("mw_address").value;
            let loca = document.getElementById("mw_address").value;
            let phone = document.getElementById("mw_whatsapp_no").value;
            //let email = document.getElementById("mw_whatsapp_no").value;
            //let dob = document.getElementById("mw_dob").value;
            let jobtype = document.getElementById("mw_job").value;
            let lco = $("#mw_lco :selected").attr('id');
            let fco = $("#mw_fco :selected").b('id');
            let gender = $("#mw_gender :selected").val();

            if (pass === "Unknown") {
                var formdata = new FormData();
                formdata.append("nin", checkInput("NA"));
                formdata.append("name", checkInput(name));
                formdata.append("pass", checkInput("Unknown_" + uniqueid()));
                formdata.append("address", checkInput(address));
                formdata.append("email", "NA");
                formdata.append("phone", checkInput(phone));
                formdata.append("gender", gender);
                formdata.append("dob", "NA");
                formdata.append("jobtype", jobtype);
                formdata.append("lco", lco);
                formdata.append("fco", fco);
                formdata.append("loca", loca);
                formdata.append("lati", "NA");
                formdata.append("longi", "NA");
                formdata.append("cty", "UG");

                if (valForm(sname, "Provide Name") === false || valForm(lco, "Choose Ugandan Company") === false || valForm(fco, "Choose Saudi Company") === false) {
                    //empty fields
                } else {
                    fetch(url + "create/co_guest",
                            {
                                body: formdata,
                                method: 'POST'
                            }).then(function (response) {
                        console.log('Response: ' + response.status);
                        if (response.status === 200) {
                            getMWDetails(pass);
                            //    alert("Migrant Worker Created");
                        } else {
                            alert('Error Ocurred Please contact System Admin');
                        }
                        return response.text();
                    }).catch(function (err) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    });
                }
            } else {
                var formdata = new FormData();
                formdata.append("nin", checkInput("NA"));
                formdata.append("name", checkInput(name));
                formdata.append("pass", checkInput(pass));
                formdata.append("address", checkInput(address));
                formdata.append("email", "NA");
                formdata.append("phone", checkInput(phone));
                formdata.append("gender", gender);
                formdata.append("dob", "NA");
                formdata.append("jobtype", jobtype);
                formdata.append("lco", lco);
                formdata.append("fco", fco);
                formdata.append("loca", loca);
                formdata.append("lati", "NA");
                formdata.append("longi", "NA");
                formdata.append("cty", "UG");

                if (valForm(sname, "Provide Name") === false || valForm(lco, "Choose Ugandan Company") === false || valForm(fco, "Choose Saudi Company") === false) {
                    //empty fields
                } else {
                    fetch(url + "create/co_guest",
                            {
                                body: formdata,
                                method: 'POST'
                            }).then(function (response) {
                        console.log('Response: ' + response.status);
                        return response.text();
                    }).then(function (data) {
                        const obj = JSON.parse(data);
                        //console.log(data);
                        //console.log(obj);
                        //console.log(obj.status);
                        if (obj.status === true) {
                            getMWDetails(pass);
                        } else {

                            showMessage('Alert', "Already Registered!", 'warning');

                        }
                    }).catch(function (err) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    });
                }
            }
        }

        function getMWCheck() {
            var pass = document.getElementById('nin').value;
            //let id = $(input).attr("id");
            //console.log(pass);
            try {
                $.ajax({
                    url: url + "fetch/workers/" + pass,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        //reset container
                    },
                    complete: function (data) {
                        //upon completion
                        //alert("Finished Loading");
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            //$("#logs").empty();
                            let row = "";
                            let i = 1;
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.user_worker;
                                //above must be customised
                                if (!isJsonArray(jdata)) {
                                    //console.log(jdata.userid);
                                    document.getElementById('mw_userid').value = jdata.userid;
                                    caseToCeemis();
                                    //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                } else {
                                    //Add ArrayList
                                    //above must be customised
                                    $.each(data.user_worker, function (index, value) {
                                        alert("Error while loading user data");
                                        //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                        //++i;
                                    });
                                }
                            } else {
                                addMigrantWorker();
                                // alert("No Data to load");
                            }
                            //appending data
                            $("#logs").append(e_data);
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                            //ShowError("Response Error", e, getMWDetails);
                        }
                    },
                    error: function (d) {

                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }});
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }

        function getMWDetails(pass) {
//var pass = document.getElementById('mw_passport');
//let id = $(input).attr("id");
            try {
                $.ajax({
                    url: url + "fetch/workers/" + pass,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        //reset container
                    },
                    complete: function (data) {
                        //upon completion
                        //alert("Finished Loading");
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            //$("#logs").empty();
                            let row = "";
                            let i = 1;
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.user_worker;
                                //above must be customised
                                if (!isJsonArray(jdata)) {
                                    //console.log(jdata.userid);
                                    document.getElementById('mw_userid').value = jdata.userid;
                                    caseToCeemis();
                                    //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                } else {
                                    //Add ArrayList
                                    //above must be customised
                                    $.each(data.user_worker, function (index, value) {
                                        alert("Error while loading user data");
                                        //e_data += '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div><div class="details"><p><muted>' + value.datreg + '</muted><br/><a href="#">' + value.activity + '</a>&nbsp&nbsp' + value.act_by + '<br/></p></div></div>';
                                        //++i;
                                    });
                                }
                            } else {
                                alert("No Data to load");
                            }
                            //appending data
                            $("#logs").append(e_data);
                        } catch (e) {
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {

                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }});
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }



        function caseToCeemis() {
//Who Selecter
            //Who Details
            let mw_sys_id = document.getElementById("mw_userid").value;
            let sname = document.getElementById("mw_name_s").value;
            let fname = document.getElementById("mw_name_f").value;
            let mname = document.getElementById("mw_name_m").value;
            let mw_name = sname + " " + fname + " " + mname;
            //let mw_name = document.getElementById("mw_name").value;
            let mw_phone = document.getElementById("mw_whatsapp_no").value;
            let mw_passport = document.getElementById("nin").value;
            let mw_job = document.getElementById("mw_job").value;
            let mw_country = document.getElementById("mw_country").value;
            let mw_city_residence = document.getElementById("mw_address").value;
            let mw_email = "NA"; //document.getElementById("mw_email").value;


            let mw_lco_id = $("#mw_lco :selected").attr('id');
            let mw_lco = document.getElementById("mw_lco").value;
            let mw_lco_tel = $("#mw_lco :selected").attr('name');
            let mw_lco_email = $("#mw_lco :selected").attr('ma');

            let mw_fco_id = $("#mw_fco :selected").attr('id');
            let mw_fco = document.getElementById("mw_fco").value;
            let mw_fco_tel = $("#mw_fco :selected").attr('name');
            let mw_fco_email = $("#mw_fco :selected").attr('ma');

            let mw_emp_name = document.getElementById("mw_emp_name").value;
            let mw_emp_number = document.getElementById("mw_emp_number").value;
            let location = document.getElementById("mw_address").value;

            let comp_help = document.getElementById("comp_help").value;

            //Attachment
            let mw_evidence = document.getElementById("mw_evidence");

            let mw_comp_category = document.getElementById("mw_comp_category").value;

            insertCase("4", "NA", "NA", "NA", "NA", "NA", "NA", mw_name, mw_phone, mw_email, mw_passport, mw_sys_id, mw_country, mw_city_residence, "NA", "NA", mw_lco_id, mw_lco, mw_lco_tel, mw_lco_email, mw_fco_id, mw_fco, mw_fco_tel, mw_fco_email, mw_emp_name, mw_emp_number, location, location, comp_help, mw_comp_category, mw_evidence);

        }

        function insertCase(case_status, who_org, who_name, who_phone, who_email, who_address, source, mw_name, mw_phone, mw_email, mw_passport, mw_sys_id, mw_country, mw_city, mw_passport_status, emp_sector, local_agency_id, local_agency, local_phone, local_email, foreign_agency_id, foreign_agency, foreign_phone, foreign_email, emp_name, emp_number, location, mw_loca, mw_narative, comp_category, evidence) {
            var formdata = new FormData();
            formdata.append("case_status", checkInput(case_status));
            formdata.append("who_org", checkInput(who_org));
            formdata.append("who_name", checkInput(who_name));
            formdata.append("who_phone", checkInput(who_phone));
            formdata.append("who_email", checkInput(who_email));
            formdata.append("who_address", checkInput(who_address));
            formdata.append("source", checkInput(source));
            formdata.append("mw_name", checkInput(mw_name));
            formdata.append("mw_phone", checkInput(mw_phone));
            formdata.append("mw_email", checkInput(mw_email));
            formdata.append("mw_passport", checkInput(mw_passport));
            formdata.append("mw_sys_id", checkInput(mw_sys_id));
            formdata.append("mw_country", checkInput(mw_country));
            formdata.append("mw_city", checkInput(mw_city));
            formdata.append("mw_passport_status", checkInput(mw_passport_status));
            formdata.append("emp_sector", checkInput(emp_sector));
            formdata.append("local_agency_id", checkInput(local_agency_id));
            formdata.append("local_agency", checkInput(local_agency));
            formdata.append("local_phone", checkInput(local_phone));
            formdata.append("local_email", checkInput(local_email));
            formdata.append("foreign_agency_id", checkInput(foreign_agency_id));
            formdata.append("foreign_agency", checkInput(foreign_agency));
            formdata.append("foreign_phone", checkInput(foreign_phone));
            formdata.append("foreign_email", checkInput(foreign_email));
            formdata.append("emp_name", checkInput(emp_name));
            formdata.append("emp_number", checkInput(emp_number));
            formdata.append("location", checkInput(location));
            formdata.append("mw_loca", checkInput(mw_loca));
            formdata.append("comp_category", checkInput(comp_category));
            formdata.append("mw_narative", checkInput(mw_narative));
            formdata.append("cty", "UG");

            fetch(url + "create/case_ticket_web",
                    {
                        body: formdata,
                        method: 'POST'
                    }).then(function (response) {
                console.log('Response: ' + response.status);
                return response.text();
            }).then(function (data) {
                const obj = JSON.parse(data);
                //console.log(obj);
                if (obj.status === true) {
                    if (obj.tag === "old") {
                        Swal.fire({
                            icon: 'info',
                            title: 'Case Already Registered With Ticket: ' + obj.error_msg,
                            text: 'Please contact Relavant Authorities for more Information',

                        });
                        document.getElementById("report_btn").disabled = false;
                    } else {
                        Swal.fire({
                            icon: 'info',
                            title: 'Case Registered with Ticket: ' + obj.error_msg,
                            text: 'Migrant Worker :' + mw_name
                        });

                        addAttachment(obj.error_msg, "Case Evidence", evidence);
                        //loadOrgan_Officer(foreign_agency_id, mw_name, obj.error_msg, comp_category, mw_narative);
                    }
                    //loadOfficer(foreign_agency_id, mw_name, obj.error_msg, emp_sector, mw_narative);
                } else {
                    showMessage('Error', "Check Your Internet Connection!", 'error');
                }
                // console.log(obj.error_msg);
            }).catch(function (err) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            });
        }


        function addAttachment(ref, det, item) {
            let formData = new FormData();
            formData.append('ref', ref);
            formData.append('det', det);
            formData.append('item', item.files[0]);
            fetch(url + "create/file",
                    {
                        body: formData,
                        method: 'POST'
                    }).then(function (response) {
                console.log('Response: ' + response.status);
                if (response.status === 200) {
                    //alert("Attachment Uploaded");
                } else {
                    //alert('Error Ocurred Please contact System Admin');
                }
                return response.text();
            }).catch(function (err) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            });
        }

        function getInfo(input) {
            try {
                $.ajax({
                    url: url + "fetch/user/0/null/" + input,
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        //reset container
                    },
                    complete: function (data) {
                        //upon completion
                        //alert("Finished Loading");
                    },
                    success: function (data) {
                        var e_data = '';
                        //console.log(data);
                        try {
                            //$("#logs").empty();
                            let row = "";
                            let i = 1;
                            if (!isEmpty(data)) {
                                row += "";
                                var jdata = data.user;
                                // Clear previous localStorage data (optional, keeps only one user logged in at a time)
                                localStorage.clear();

                                // Convert user object into JSON string
                                const officerDataString = JSON.stringify(jdata);

                                // Store JSON string in localStorage
                                localStorage.setItem('officerData', officerDataString);
                                location.href = 'home.html';
                            } else {
                                alert("No Data to load");
                            }
                            //appending data
                            $("#logs").append(e_data);
                        } catch (e) {
                            //ShowError("Response Error", e, getAccount);
                        }
                    },
                    error: function (d) {
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }});
            } catch (ex) {
                showMessage('Error', "Check Your Internet Connection!", 'error');
            }
        }


        async function getEm_numbers(elm) {
            fetch(sessionStorage.getItem('url') + "fetch/em_number")
                    .then(res => res.json())
                    .then(data => {
                        //console.log(data);
                        populateNumber(data, elm);
                    })
                    .catch(err => {
                        document.getElementById(elm).innerHTML =
                                "<div class='col-12 alert alert-danger'>No Available Data.</div>";
                        console.error("Error fetching tutors:", err);
                    });
        }

        function populateNumber(data, elm) {
            const container = document.getElementById(elm);

            data.numbers.forEach(item => {
                const card = document.createElement("div");
                card.className = "col-md-12 mb-3"; // 2 cards per row

                card.innerHTML = `
                            <div class="card shadow-sm rounded-3 p-3 h-100">
                              <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                  <h5 class="card-title mb-3">${item.names}</h5>
                                  <p class="mb-2">
                                    <a href="tel:${item.phone}" class="btn btn-outline-success btn-sm">${item.phone}</a>
                                  </p>
                                  <p class="mb-2">
                                    <a href="mailto:${item.email}" class="btn btn-outline-primary btn-sm">${item.email}</a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          `;

                container.appendChild(card);
            });
        }



        async function getCase(elm) {
            // Show spinner before AJAX call
            showProgress();
            fetch(sessionStorage.getItem('url') + "fetch/case_ticket/")
                    .then(res => res.json())
                    .then(data => {
                        showMessage('Alert!', "Task Successfull", 'success');

                        //console.log(data);
                        populateCases(data, elm);
                    })
                    .catch(err => {
                        document.getElementById(elm).innerHTML =
                                "<div class='col-12 alert alert-danger'>No Available Data.</div>";
                        console.error("Error fetching tutors:", err);
                    });
        }


        function populateCases(data, elm) {
            const container = document.getElementById(elm);

            data.Case_ticket.forEach((item, index) => {
                const card = document.createElement("div");
                card.className = "col-md-12 mb-3";

                // Generate unique IDs for accordion header and collapse
                const headingId = `heading-${index}`;
                const collapseId = `collapse-${index}`;

                // Only first item is shown by default
                const showClass = index === 0 ? "show" : "";

                card.innerHTML = `
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="${headingId}">
                                        <button class="accordion-button ${index !== 0 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="${collapseId}">
                                            ${item.case_id}
                                        </button>
                                    </h2>

                                    <div id="${collapseId}" class="accordion-collapse collapse ${showClass}" aria-labelledby="${headingId}" data-bs-parent="#${elm}">
                                        <div class="accordion-body">
                                            <h3>${item.comp_category}</h3>
                                            <p>${item.mw_assistance}</p>
                                            <p class="text-center">${item.mw_loca}</p>
                                               <ul class="btn-list d-flex justify-content-between">
                                                    <li class="width">
                                                            <button type="button" class="btn btn-info btn-sm case-activity-btn" data-bs-toggle="offcanvas" data-bs-target="#caseTimeline" data-case-id="${item.case_id}" >Case Activity</button>
                                                       
                                                    </li>
                                                    <li>
                                                            ${getCaseStatus(item.case_status, item.case_id)}
                                                       
                                                    </li>
                                                </ul>
                                        </div>
                                        <small class="text-muted mt-3 text-end d-block">${item.datereg}</small>
                                    </div>
                                </div>
                            `;

                container.appendChild(card);
            });
        }




        function getCaseStatus(input, caseId) {
            let btnClass = "btn-secondary";
            let text = "Unclear Status";

            if (input === '0') {
                btnClass = "btn-danger";
                text = "New Case";
            } else if (input === '1' || input === '2') {
                btnClass = "btn-info";
                text = "In-Progress";
            } else if (input === '3') {
                btnClass = "btn-info";
                text = "In-Progress";
            } else if (input === '4') {
                btnClass = "btn-success";
                text = "Closed Case";
            } else if (input === '5') {
                btnClass = "btn-success";
                text = "Compliment";
            }

            return `
                    <button class="btn ${btnClass} btn-sm case-status-btn"
                            type="button"
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#casechat"
                            data-case-id="${caseId}">
                        ${text} <i class="ri-arrow-right-s-line"></i>
                    </button>
                `;
        }



        function loadLogsTimelime(input, elm) {
            // console.log(input);
            try {
                $.ajax({
                    url: url + "fetch/log/0/" + input + "/null",
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    // timeout:3000, //3 second timeout 
                    processData: false,
                    contentType: false,
                    beforeSend: function () {               //tbody.html("<tr><td colspan='5' align='center'><i class = 'fa fa-spinner spin'></i> Loading</td></tr>");
                        //$("#" + elm).html('<tr><td colspan="8" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></td></tr>');
                    },
                    complete: function (data) {
                        //tbody.html("<i class = 'fa fa-spinner spin'></i> Please Wait.."+ JSON.stringify(data));
                    },
                    success: function (data) {
                        var e_data = '';
                        try {
                            loadTimeline(elm, data);
                        } catch (e) {
                            console.log(e);
                            showMessage('Error', "Check Your Internet Connection!", 'error');
                        }
                    },
                    error: function (d) {
                        console.log(d);
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                console.log(ex);
                showMessage('Error', "Check Your Internet Connection!", 'error');

            }
        }

// Function to populate timeline
// Function to populate timeline with JSON object array
        function loadTimeline(elm, logData) {
            const timeline = document.getElementById(elm);  // Ensure elm is passed and used to select the container

            console.log(logData);
            // Check if logData has a 'log' key
            if (!logData || !logData.log || !Array.isArray(logData.log)) {
                console.error("Invalid log data structure");
                return;
            }

            logData.log.forEach(entry => {
                // Create timeline event container
                const timelineEvent = document.createElement("li");
                timelineEvent.classList.add("timeline-event");

                // Create date element (ensure entry.datereg exists)
                const timelineDate = document.createElement("div");
                timelineDate.classList.add("timeline-date");
                timelineDate.textContent = entry.datereg || "No date available";  // Fallback if no date

                // Create dot
                const timelineDot = document.createElement("div");
                timelineDot.classList.add("timeline-dot");

                // Create event content
                const timelineContent = document.createElement("div");
                timelineContent.classList.add("timeline-event-content");

                // Safely insert content by checking if the properties exist
                const name = entry.name ? escapeHTML(entry.name) : "Unknown Name";
                const id = entry.id ? escapeHTML(entry.id) : "No ID";
                const status = entry.status ? escapeHTML(entry.status) : "No Status";
                const actedBy = entry.act_by ? escapeHTML(entry.act_by) : "No actor";
                const ref = entry.ref ? escapeHTML(entry.ref) : "No reference";
                const details = entry.details ? escapeHTML(entry.details) : "No details";

                timelineContent.innerHTML = `
            <strong>${name}</strong><br>
            <span class="event-snippet">Reference: ${ref}</span><br>
            <span class="event-snippet">Action: ${details}</span>
            <span class="event-snippet">Acted by: ${actedBy}</span><br>
        `;

                // Append elements to the timeline event
                timelineEvent.appendChild(timelineDate);
                timelineEvent.appendChild(timelineDot);
                timelineEvent.appendChild(timelineContent);

                // Append the event to the timeline container
                timeline.appendChild(timelineEvent);
            });
        }

// Helper function to escape HTML characters to prevent XSS
        function escapeHTML(str) {
            return str.replace(/[&<>"'`=\/]/g, (match) => {
                const escapeMap = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;',
                    '`': '&#096;',
                    '=': '&#61;',
                    '/': '&#47;'
                };
                return escapeMap[match];
            });
        }




        function loadMsg(input) {
            try {
                $.ajax({
                    url: sessionStorage.getItem('url') + "fetch/message/" + input + "/null/null/null",
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        $("#chat_div").html('<tr><td colspan="60" align="center"><div class="spinner-border text-primary" role="status"><span class="sr-only">.</span></div></td></tr>');
                    },
                    success: function (data) {
                        try {
                            $("#chat_div").empty();
                            //console.log(data.message);
                            // Save data globally for filtering
                            window.msgData = data.message;
                            // Populate table with initial data
                            populateMsg(data.message);

                        } catch (e) {
                            console.log(e);
                            showMessage('Error', "Check Your Internet Connection!", 'error');

                        }
                    },
                    error: function (d) {
                        console.log(d);
                        showMessage('Error', "Check Your Internet Connection!", 'error');
                    }
                });
            } catch (ex) {
                console.log(ex);
                showMessage('Error', "Check Your Internet Connection!", 'error');

            }
        }


        const chatContainer = document.querySelector('#chat_div');

// Helper function to create a message element
        function createMessageElement(sender, by, text, timestamp) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender === 'User' ? 'user' : 'bot'}`;

            const textDiv = document.createElement('div');
            textDiv.className = 'text';
            textDiv.textContent = text;

            const metadataDiv = document.createElement('div');
            metadataDiv.className = 'metadata';

            const usernameSpan = document.createElement('span');
            usernameSpan.className = 'username';
            usernameSpan.textContent = by;

            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'timestamp';
            timestampSpan.textContent = timestamp;

            metadataDiv.appendChild(usernameSpan);
            metadataDiv.appendChild(timestampSpan);

            messageDiv.appendChild(textDiv);
            messageDiv.appendChild(metadataDiv);

            return messageDiv;
        }


        // Populate the chat with messages
        // Function to populate messages into the chat
        function populateMsg(data) {
            //console.log(data);

            // Normalize: if single object, wrap it into an array
            let messages = Array.isArray(data) ? data : [data];

            // Sort the messages by date in ascending order
            messages.sort((a, b) => new Date(a.datereg) - new Date(b.datereg));

            // Clear the chat container before populating
            chatContainer.innerHTML = '';

            // Loop through the sorted messages and append them
            messages.forEach(message => {
                const sender = message.senderid && message.senderid.startsWith('U') ? 'User' : 'Bot';
                const text = message.msgtext || "";
                const by = message.msgby || "";
                const timestamp = message.datereg ? new Date(message.datereg).toLocaleString() : "";

                const messageElement = createMessageElement(sender, by, text, timestamp);
                chatContainer.appendChild(messageElement);
            });
        }


        function caseChatMsg(caseid, userid, msgtext, msgto, msgby, status) {
            let formdata = new FormData();
            formdata.append("groupid", caseid);
            formdata.append("senderid", userid);
            formdata.append("msgtext", msgtext);
            formdata.append("msgto", msgto);
            formdata.append("msgby", msgby);
            formdata.append("status", status);


            fetch(sessionStorage.getItem('url') + "create/message",
                    {
                        body: formdata,
                        method: 'POST'
                    }).then(function (response) {
                console.log('Response: ' + response.status);
                if (response.status === 200) {
                    showMessage('Sent!', "Message Sent", 'success');

                    // Reload messages for this case
                    loadMsg(caseid);

                    // Open the offcanvas if it’s not already open
                    const offcanvasEl = document.getElementById('casechat');
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl)
                            || new bootstrap.Offcanvas(offcanvasEl);
                    bsOffcanvas.show();
                } else {
                    showMessage('Error', "Check Your Internet Connection!", 'error');
                }
                return response.text();
            }).catch(function (err) {
                console.log(err);
                showMessage('Error', "Check Your Internet Connection!", 'error');
            });
        }


        function internalCaseReport(status, name, phone, email, passport, userid, job, lco, fco, lati, longi, loca, assistance, category, file) {
            console.log("Internal Case Reporter");
            var form = new FormData();
            form.append("case_status", status);
            form.append("mw_name", name);
            form.append("mw_phone", phone);
            form.append("mw_email", email);
            form.append("mw_passport", passport);
            form.append("mw_sys_id", userid);
            form.append("emp_sector", job);
            form.append("local_agency_id", lco);
            form.append("local_agency", lco);
            form.append("local_phone", lco);
            form.append("local_email", lco);
            form.append("foreign_agency_id", fco);
            form.append("foreign_agency", fco);
            form.append("foreign_phone", fco);
            form.append("foreign_email", fco);
            form.append("mw_lati", lati);
            form.append("mw_longi", longi);
            form.append("mw_loca", loca);
            form.append("mw_assistance", assistance);
            form.append("comp_category", category);
            form.append("cty", "UG");

            showProgress();


            var settings = {
                "url": sessionStorage.getItem('url') + "create/case_ticket_summary",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                //console.log(response);

                const obj = JSON.parse(response);

                if (obj.status === true) {
                    //var queryString = "?" + email;
                    Swal.fire({
                        icon: 'success',
                        title: 'Case Reported!',
                        text: 'Case ID:' + obj.error_msg,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            sessionStorage.setItem('cid', obj.error_msg);
                            //window.location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Alert!',
                        text: 'Error Occurred while Reporting Case',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }

        function addAudio(ref, det, audioFile = null) {
            let formData = new FormData();
            formData.append('ref', ref);
            formData.append('det', det);

            if (audioFile) {
                formData.append('item', audioFile);
            }

            var settings = {
                "url": sessionStorage.getItem('url') + "create/file",
                "method": "POST",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": formData
            };

            $.ajax(settings).done(function (response) {
                console.log(response);

                const obj = JSON.parse(response);
                if (obj.status === true) {

                    showMessage('Alert', "Audio Attached and Sent", 'success');
                } else {
                    showMessage('Error', "Check Your Internet Connection!", 'error');
                }
            });


        }


        async function getAmnesty(elm) {
            // Show spinner before AJAX call
            showProgress();
            fetch(sessionStorage.getItem('url') + "fetch/amnesty")
                    .then(res => res.json())
                    .then(data => {
                        showMessage('Alert!', "Task Successfull", 'success');
                        //console.log(data);
                        renderGoogleMap(elm, data.amnesty);
                    })
                    .catch(err => {
                        document.getElementById(elm).innerHTML =
                                "<div class='col-12 alert alert-danger'>No Available Data.</div>";
                        console.error("Error fetching tutors:", err);
                    });
        }


        async function getWorkersAndAmnesty(mapId) {
            showProgress();
            const baseUrl = sessionStorage.getItem('url');

            try {
                const [amnestyRes, workerRes] = await Promise.all([
                    fetch(sessionStorage.getItem('url') + "fetch/amnesty").then(r => r.json()),
                    fetch(sessionStorage.getItem('url') + "fetch/workerloca").then(r => r.json())
                ]);


                showMessage('Alert!', "Task Successfull", 'success');

                // Extract & normalize data
                const amnestyData = (amnestyRes.amnesty || []).map(a => ({
                        name: a.name,
                        latitude: a.latitude,
                        longitude: a.longitude,
                        datereg: a.datereg,
                        type: "amnesty"
                    }));

                const workerData = (workerRes.user_worker || []).map(w => ({
                        name: w.names,
                        latitude: w.lati,
                        longitude: w.longi,
                        datereg: w.address,
                        type: "worker"
                    }));

                // Merge both datasets
                const combined = [...amnestyData, ...workerData];

                renderGoogleMapBoth(mapId, combined);

            } catch (err) {
                hideProgress();
                document.getElementById(mapId).innerHTML =
                        "<div class='col-12 alert alert-danger'>No Available Data.</div>";
                console.error("Error fetching worker/amnesty data:", err);
            }
        }

        async function renderGoogleMapBoth(mapId, locations, defaultZoom = 18) {
            if (!locations || !Array.isArray(locations) || locations.length === 0) {
                console.warn('No valid locations to display.');
                return;
            }

            const validLocations = locations.filter(
                    loc => loc && loc.latitude && loc.longitude &&
                        loc.latitude !== "NA" && loc.longitude !== "NA"
            );

            if (validLocations.length === 0) {
                console.warn('No valid lat/long values.');
                return;
            }

            let mapCenter = {lat: parseFloat(validLocations[0].latitude), lng: parseFloat(validLocations[0].longitude)};
            let map = new google.maps.Map(document.getElementById(mapId), {
                zoom: defaultZoom,
                center: mapCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
                streetViewControl: true
            });

            const bounds = new google.maps.LatLngBounds();

            // Add all markers
            validLocations.forEach(loc => {
                const position = {lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude)};
                bounds.extend(position);

                let iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
                if (loc.type === "amnesty")
                    iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
                if (loc.type === "worker")
                    iconUrl = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";

                const marker = new google.maps.Marker({
                    position,
                    map,
                    icon: {url: iconUrl, scaledSize: new google.maps.Size(40, 40)},
                    title: loc.name || "Unknown"
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                <b>${loc.name || 'Unknown'}</b><br>
                Type: ${loc.type}<br>
                Lat: ${position.lat}, Lon: ${position.lng}<br>
                Info: ${loc.datereg || 'N/A'}
            `
                });

                marker.addListener("click", () => infoWindow.open(map, marker));
            });

            // Center on user location first
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                        pos => {
                            const userLoc = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                            const userMarker = new google.maps.Marker({
                                position: userLoc,
                                map,
                                icon: {url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", scaledSize: new google.maps.Size(40, 40)},
                                title: "You are here"
                            });

                            const userInfo = new google.maps.InfoWindow({
                                content: `<b>You are here</b><br>Lat: ${userLoc.lat}, Lon: ${userLoc.lng}`
                            });
                            userMarker.addListener("click", () => userInfo.open(map, userMarker));

                            // Initially center on user
                            map.setCenter(userLoc);
                            map.setZoom(defaultZoom); // zoom in on user
                        },
                        err => {
                            console.warn("Geolocation failed, showing default center.", err);
                            map.setCenter(mapCenter);
                        }
                );
            } else {
                console.warn("Geolocation not supported, showing default center.");
                map.setCenter(mapCenter);
        }

        // Do NOT call fitBounds automatically — user can drag/zoom manually
        }



        async function renderGoogleMap(mapId, locations, defaultZoom = 18) {
            if (!locations || !Array.isArray(locations) || locations.length === 0) {
                console.warn('No valid locations to display.');
                return;
            }

            const validLocations = locations.filter(loc => loc && loc.latitude && loc.longitude);
            if (validLocations.length === 0) {
                console.warn('No valid locations with latitude/longitude.');
                return;
            }

            // Center map on first location initially
            const firstLoc = validLocations[0];
            const map = new google.maps.Map(document.getElementById(mapId), {
                zoom: defaultZoom,
                center: {lat: parseFloat(firstLoc.latitude), lng: parseFloat(firstLoc.longitude)},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            const bounds = new google.maps.LatLngBounds();

            // Add all markers
            validLocations.forEach(loc => {
                const position = {lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude)};
                bounds.extend(position);

                const marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: {
                        url: loc.pic || "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new google.maps.Size(40, 40)
                    },
                    title: loc.name || "Unknown"
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                <b>${loc.name || 'Unknown'}</b><br>
                Lat: ${position.lat}, Lon: ${position.lng}<br>
                Date: ${loc.datereg || 'N/A'}
            `
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });

            // Add user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                        position => {
                            const userLoc = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                            const userMarker = new google.maps.Marker({
                                position: userLoc,
                                map: map,
                                icon: {
                                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                    scaledSize: new google.maps.Size(40, 40)
                                },
                                title: "You are here"
                            });

                            const userInfo = new google.maps.InfoWindow({
                                content: `<b>You are here</b><br>Lat: ${userLoc.lat}, Lon: ${userLoc.lng}`
                            });

                            userMarker.addListener("click", () => userInfo.open(map, userMarker));

                            bounds.extend(userLoc);

                            // Fit all markers if more than 1, else zoom close
                            if (validLocations.length + 1 > 1) {
                                map.fitBounds(bounds);
                            } else {
                                map.setCenter(userLoc);
                                map.setZoom(defaultZoom);
                            }
                        },
                        error => {
                            console.warn("Error getting user location:", error.message);
                            // If geolocation fails, fit only the existing markers
                            if (validLocations.length > 1)
                                map.fitBounds(bounds);
                            else
                                map.setCenter({lat: parseFloat(firstLoc.latitude), lng: parseFloat(firstLoc.longitude)});
                        }
                );
            } else {
                console.warn("Geolocation not supported");
                if (validLocations.length > 1)
                    map.fitBounds(bounds);
        }
        }

        async function renderGoogleMapAdvanced(mapId, locations, defaultZoom = 18) {
            if (!locations || !Array.isArray(locations) || locations.length === 0) {
                console.warn('No valid locations to display.');
                return;
            }

            const validLocations = locations.filter(loc => loc && loc.latitude && loc.longitude);
            if (validLocations.length === 0) {
                console.warn('No valid locations with latitude/longitude.');
                return;
            }

            const firstLoc = validLocations[0];
            const map = new google.maps.Map(document.getElementById(mapId), {
                zoom: defaultZoom,
                center: {lat: parseFloat(firstLoc.latitude), lng: parseFloat(firstLoc.longitude)},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            const bounds = new google.maps.LatLngBounds();

            // Render all data locations
            validLocations.forEach(loc => {
                const position = {lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude)};
                bounds.extend(position);

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: map,
                    position: position,
                    title: loc.name || "Unknown",
                    content: `
                <div style="text-align:center;">
                    <img src="${loc.pic || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'}" width="40" height="40"/>
                    <div>${loc.name || 'Unknown'}</div>
                </div>
            `
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                <b>${loc.name || 'Unknown'}</b><br>
                Lat: ${position.lat}, Lon: ${position.lng}<br>
                Date: ${loc.datereg || 'N/A'}
            `
                });

                marker.addListener("click", () => infoWindow.open(map, marker));
            });

            // Add user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                        position => {
                            const userLoc = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            bounds.extend(userLoc);

                            const userMarker = new google.maps.marker.AdvancedMarkerElement({
                                map: map,
                                position: userLoc,
                                title: "You are here",
                                content: `
                        <div style="text-align:center;">
                            <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" width="40" height="40"/>
                            <div>You are here</div>
                        </div>
                    `
                            });

                            const userInfo = new google.maps.InfoWindow({
                                content: `<b>You are here</b><br>Lat: ${userLoc.lat}, Lon: ${userLoc.lng}`
                            });

                            userMarker.addListener("click", () => userInfo.open(map, userMarker));

                            // Adjust zoom: if multiple markers, fit bounds, else zoom close
                            if (validLocations.length + 1 > 1)
                                map.fitBounds(bounds);
                            else {
                                map.setCenter(userLoc);
                                map.setZoom(defaultZoom);
                            }
                        },
                        error => {
                            console.warn("Error getting user location:", error.message);
                            if (validLocations.length > 1)
                                map.fitBounds(bounds);
                        }
                );
            } else {
                console.warn("Geolocation not supported");
                if (validLocations.length > 1)
                    map.fitBounds(bounds);
        }
        }


        async function getWorker(elm) {
            // Show spinner before AJAX call
            showProgress();
            fetch(sessionStorage.getItem('url') + "fetch/user_worker")
                    .then(res => res.json())
                    .then(data => {
                        //showMessage('Alert!', "Task Successfull", 'success');
                        console.log(data);
                        renderGoogleMap(elm, data.amnesty);
                    })
                    .catch(err => {
                        document.getElementById(elm).innerHTML =
                                "<div class='col-12 alert alert-danger'>No Available Data.</div>";
                        console.error("Error fetching tutors:", err);
                    });
        }


        loadPageScripts();
    }




    Init();
});