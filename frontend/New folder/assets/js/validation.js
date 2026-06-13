(function($) {
    "use strict";

	if($('#passwordInput').length > 0) {
	let passwordInput = document.querySelector('#passwordInput input[type="password"]');
    let passwordStrength= document.getElementById('passwordStrength');
    let poor = document.querySelector('#passwordStrength #poor');
    let weak = document.querySelector('#passwordStrength #weak');
    let strong = document.querySelector('#passwordStrength #strong');
    let heavy = document.querySelector('#passwordStrength #heavy');
    let passwordInfo = document.getElementById('passwordInfo');
    let passcheck = document.querySelector('#passwordInput .pass-checked');

    let lowercaseRegExp  = /[a-z]/;
    let uppercaseRegExp  = /[A-Z]/;
    let numberRegExp     = /[0-9]/;
    let specialRegExp    = /[^a-zA-Z0-9\s]/;

	let whitespaceRegExp = /^$|\s+/;

    passwordInput.oninput= function(){

        let passwordValue= passwordInput.value;
        let passwordLength= passwordValue.length;
        let hasLower    = passwordValue.match(lowercaseRegExp);
        let hasUpper    = passwordValue.match(uppercaseRegExp);
        let hasNumber   = passwordValue.match(numberRegExp);
        let hasSpecial  = passwordValue.match(specialRegExp);
        let whitespace  = passwordValue.match(whitespaceRegExp);

		if(passwordValue != ""){
			passwordStrength.style.display = "block";
			passwordStrength.style.display = "flex";
			passwordInfo.style.display = "block";
			passwordInfo.style.color = "black";
			if(whitespace)
			{
				passwordInfo.textContent = "Whitespaces are not allowed";
			}
			else {
				poorPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial);
				weakPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial);
				strongPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial);
				heavyPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial);
			}

		}
		else {
			   passwordInfo.style.display = "none";
			   passwordStrength.classList.remove("poor-active");
			   passwordStrength.classList.remove("avg-active");
			   passwordStrength.classList.remove("strong-active");
			   passwordStrength.classList.remove("heavy-active");
			   if(passcheck) passcheck.classList.remove("active");

		   }
		}

		// Level 1 — too short
		function poorPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial){
			if(passwordLength < 8)
			{
			   poor.classList.add("active");
			   passwordStrength.classList.add("poor-active");
			   passwordStrength.classList.remove("avg-active");
			   passwordStrength.classList.remove("strong-active");
			   passwordStrength.classList.remove("heavy-active");
			   passwordInfo.style.display = "block";
			   passwordInfo.style.color = "#FF0000";
			   passwordInfo.innerHTML  = '' + "Too short. Must be at least 8 characters";
			}
		}

		// Level 2 — has length but missing variety
		function weakPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial){
			if(passwordLength >= 8 && (hasLower || hasUpper || hasNumber || hasSpecial))
			{
			   weak.classList.add("active");
			   passwordStrength.classList.remove("poor-active");
			   passwordStrength.classList.add("avg-active");
			   passwordStrength.classList.remove("strong-active");
			   passwordStrength.classList.remove("heavy-active");
			   passwordInfo.style.display = "block";
			   passwordInfo.style.color = "#FFB54A";
			   passwordInfo.innerHTML = '' + "Weak. Add uppercase, numbers & special characters";
			}else{
			 weak.classList.remove("active");
		   }
		}

		// Level 3 — has lowercase + uppercase + (number or special)
		function strongPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial){
		   if(passwordLength >= 8 && hasLower && hasUpper && (hasNumber || hasSpecial))
			{
			 strong.classList.add("active");
			 passwordStrength.classList.remove("avg-active");
			 passwordStrength.classList.remove("poor-active");
			 passwordStrength.classList.add("strong-active");
			 passwordStrength.classList.remove("heavy-active");
			 passwordInfo.innerHTML = '' + "Almost. Add a special character to make it stronger";
			 passwordInfo.style.color = "#1D9CFD";
		   }else{
			 strong.classList.remove("active");
		   }
		}

		// Level 4 — has all: lowercase + uppercase + number + special
		function heavyPasswordStrength(passwordLength, hasLower, hasUpper, hasNumber, hasSpecial){
		  if(passwordLength >= 8 && hasLower && hasUpper && hasNumber && hasSpecial)
			{
			 heavy.classList.add("active");
			 passwordStrength.classList.remove("poor-active");
			 passwordStrength.classList.remove("avg-active");
			 passwordStrength.classList.remove("strong-active");
			 passwordStrength.classList.add("heavy-active");
			 if(passcheck) passcheck.classList.add("active");
			 passwordInfo.style.display = "block";
			 passwordInfo.innerHTML = "Password is strong!";
			 passwordInfo.style.color = "#159F46";
			 var signupBtn = document.getElementById("signup-btn");
			 if(signupBtn) signupBtn.disabled = false;
		   }else{
			 heavy.classList.remove("active");
			 if(passcheck) passcheck.classList.remove("active");
			 passwordInfo.style.display = "block";
			 var signupBtn = document.getElementById("signup-btn");
			 if(signupBtn) signupBtn.disabled = true;
		   }
		}
	}


	if($('#passwordInputs').length > 0) {

	let passwordInput1 = document.querySelector('#passwordInputs input[type="password"]');
    let passwordStrength1= document.getElementById('passwordStrengths');
    let poor1 = document.querySelector('#passwordStrengths #poors');
    let weak1 = document.querySelector('#passwordStrengths #weaks');
    let strong1 = document.querySelector('#passwordStrengths #strongs');
    let heavy1 = document.querySelector('#passwordStrengths #heavys');
    let passwordInfos = document.getElementById('passwordInfos');
    let passcheck1 = document.querySelector('#passwordInputs .pass-checked');

    let lowercase1RegExp  = /[a-z]/;
    let uppercase1RegExp  = /[A-Z]/;
    let number1RegExp     = /[0-9]/;
    let special1RegExp    = /[^a-zA-Z0-9\s]/;

	let whitespace1RegExp1 = /^$|\s+/;

    passwordInput1.oninput= function(){

        let passwordValue1= passwordInput1.value;
        let passwordLength1= passwordValue1.length;
        let hasLower1   = passwordValue1.match(lowercase1RegExp);
        let hasUpper1   = passwordValue1.match(uppercase1RegExp);
        let hasNumber1  = passwordValue1.match(number1RegExp);
        let hasSpecial1 = passwordValue1.match(special1RegExp);
        let whitespace1 = passwordValue1.match(whitespace1RegExp1);

		if(passwordValue1 != ""){
			passwordStrength1.style.display = "block";
			passwordStrength1.style.display = "flex";
			passwordInfos.style.display = "block";
			passwordInfos.style.color = "black";
			if(whitespace1)
			{
				passwordInfos.textContent = "Whitespaces are not allowed";
			}
			else {
				poor1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1);
				weak1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1);
				strong1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1);
				heavy1passwordStrength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1);
			}

		}
		else {
			   passwordInfos.style.display = "none";
			   passwordStrength1.classList.remove("poor-active");
			   passwordStrength1.classList.remove("avg-active");
			   passwordStrength1.classList.remove("strong-active");
			   passwordStrength1.classList.remove("heavy-active");
			   if(passcheck1) passcheck1.classList.remove("active");

		   }
		}

		function poor1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1){
			if(passwordLength1 < 8)
			{
			   poor1.classList.add("active");
			   passwordStrength1.classList.add("poor-active");
			   passwordStrength1.classList.remove("avg-active");
			   passwordStrength1.classList.remove("strong-active");
			   passwordStrength1.classList.remove("heavy-active");
			   passwordInfos.style.display = "block";
			   passwordInfos.style.color = "#FF0000";
			   passwordInfos.innerHTML  = '' + "Too short. Must be at least 8 characters";
			}
		}

		function weak1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1){
			if(passwordLength1 >= 8 && (hasLower1 || hasUpper1 || hasNumber1 || hasSpecial1))
			{
			   weak1.classList.add("active");
			   passwordStrength1.classList.remove("poor-active");
			   passwordStrength1.classList.add("avg-active");
			   passwordStrength1.classList.remove("strong-active");
			   passwordStrength1.classList.remove("heavy-active");
			   passwordInfos.style.display = "block";
			   passwordInfos.style.color = "#FFB54A";
			   passwordInfos.innerHTML = '' + "Weak. Add uppercase, numbers & special characters";
			}else{
			 weak1.classList.remove("active");
		   }
		}

		function strong1Password1Strength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1){
		   if(passwordLength1 >= 8 && hasLower1 && hasUpper1 && (hasNumber1 || hasSpecial1))
			{
			 strong1.classList.add("active");
			 passwordStrength1.classList.remove("avg-active");
			 passwordStrength1.classList.remove("poor-active");
			 passwordStrength1.classList.add("strong-active");
			 passwordStrength1.classList.remove("heavy-active");
			 passwordInfos.innerHTML = '' + "Almost. Add a special character to make it stronger";
			 passwordInfos.style.color = "#1D9CFD";
		   }else{
			 strong1.classList.remove("active");
		   }
		}

		function heavy1passwordStrength1(passwordLength1, hasLower1, hasUpper1, hasNumber1, hasSpecial1){
		  if(passwordLength1 >= 8 && hasLower1 && hasUpper1 && hasNumber1 && hasSpecial1)
			{
			 heavy1.classList.add("active");
			 passwordStrength1.classList.remove("poor-active");
			 passwordStrength1.classList.remove("avg-active");
			 passwordStrength1.classList.remove("strong-active");
			 passwordStrength1.classList.add("heavy-active");
			 if(passcheck1) passcheck1.classList.add("active");
			 passwordInfos.style.display = "block";
			 passwordInfos.innerHTML = "Password is strong!";
			 passwordInfos.style.color = "#159F46";
		   }else{
			 heavy1.classList.remove("active");
			 if(passcheck1) passcheck1.classList.remove("active");
			 passwordInfos.style.display = "block";
		   }
		}

	}

	// ─── Email Validation (Register Form) ───────────────────────────────────
	if ($('#register-form').length > 0) {
		var emailInput = document.getElementById('email');
		if (emailInput) {

			var emailFeedback = document.createElement('div');
			emailFeedback.style.cssText = 'font-size:13px;margin-top:5px;display:none;';
			emailInput.closest('.mb-3').appendChild(emailFeedback);

			var disposableDomains = [
				'mailinator.com','tempmail.com','guerrillamail.com','yopmail.com',
				'sharklasers.com','grr.la','spam4.me','trashmail.com','trashmail.me',
				'trashmail.net','trashmail.io','dispostable.com','maildrop.cc',
				'throwam.com','fakeinbox.com','10minutemail.com','10minutemail.net',
				'mailnull.com','mailnesia.com','discard.email','tempinbox.com',
				'mailsac.com','getnada.com','tempr.email','throwaway.email',
				'mintemail.com','spamgourmet.com','getairmail.com','boun.cr',
				'spamevader.com','mytemp.email','tempemail.co','tmpmail.net',
				'tmpmail.org','tempmailaddress.com','emailondeck.com'
			];

			var domainCorrections = {
				'gmial.com':'gmail.com','gmal.com':'gmail.com','gmail.co':'gmail.com',
				'gmail.comm':'gmail.com','gamil.com':'gmail.com','gnail.com':'gmail.com',
				'gmaill.com':'gmail.com','gmai.com':'gmail.com',
				'yahooo.com':'yahoo.com','yaho.com':'yahoo.com','yahoo.co':'yahoo.com',
				'yahoo.comm':'yahoo.com','yhoo.com':'yahoo.com',
				'hotmial.com':'hotmail.com','hotmal.com':'hotmail.com',
				'hotmail.co':'hotmail.com','hotmail.comm':'hotmail.com','hotmai.com':'hotmail.com',
				'outlok.com':'outlook.com','outloook.com':'outlook.com',
				'outloo.com':'outlook.com','outlook.co':'outlook.com'
			};

			var emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
			var emailCheckTimeout = null;

			function showEmailMsg(msg, color, isHTML) {
				if (isHTML) {
					emailFeedback.innerHTML = msg;
				} else {
					emailFeedback.textContent = msg;
				}
				emailFeedback.style.color = color;
				emailFeedback.style.display = 'block';
				emailInput.style.borderColor = (color === '#159F46') ? '#159F46' :
				                               (color === '#FF0000') ? '#FF0000' : '';
			}

			function clearEmailMsg() {
				emailFeedback.style.display = 'none';
				emailInput.style.borderColor = '';
			}

			async function runFullEmailCheck(val) {
				if (!emailRegex.test(val)) {
					showEmailMsg('Please enter a valid email address', '#FF0000');
					return;
				}

				var domain = val.split('@')[1].toLowerCase();

				// 1. Typo suggestion
				if (domainCorrections[domain]) {
					var corrected = val.split('@')[0] + '@' + domainCorrections[domain];
					showEmailMsg(
						'Did you mean <a href="#" id="emailSuggestLink" style="color:#1D9CFD;text-decoration:underline;">' + corrected + '</a>?',
						'#FFB54A', true
					);
					var link = document.getElementById('emailSuggestLink');
					if (link) {
						link.addEventListener('click', function(e) {
							e.preventDefault();
							emailInput.value = corrected;
							runFullEmailCheck(corrected);
						});
					}
					return;
				}

				// 2. Disposable email check
				if (disposableDomains.indexOf(domain) !== -1) {
					showEmailMsg('Disposable email addresses are not allowed', '#FF0000');
					return;
				}

				// 3. Duplicate check via API
				showEmailMsg('Checking availability\u2026', '#888');
				try {
					var apiBase = (typeof API_CONFIG !== 'undefined') ? API_CONFIG.BASE_URL : 'http://localhost:5000/api/v1';
					var resp = await fetch(apiBase + '/auth/check-email?email=' + encodeURIComponent(val));
					var data = await resp.json();
					if (!data.available) {
						showEmailMsg('Email already exists. <a href="/auth/login" style="color:#FF0000;text-decoration:underline;">Please log in instead.</a>', '#FF0000', true);
					} else {
						showEmailMsg('\u2713 Email is available', '#159F46');
					}
				} catch (e) {
					clearEmailMsg();
				}
			}

			// Real-time format check while typing
			emailInput.addEventListener('input', function() {
				var val = this.value.trim();
				if (val === '') { clearEmailMsg(); return; }
				if (!emailRegex.test(val)) {
					showEmailMsg('Please enter a valid email address', '#FF0000');
				} else {
					clearEmailMsg();
				}
			});

			// Full check when user leaves the field
			emailInput.addEventListener('blur', function() {
				var val = this.value.trim();
				if (val === '') { clearEmailMsg(); return; }
				clearTimeout(emailCheckTimeout);
				emailCheckTimeout = setTimeout(function() {
					runFullEmailCheck(val);
				}, 300);
			});
		}
	}

})(jQuery);
