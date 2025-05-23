const nodemailer = require("nodemailer");

async function sendOtp(recieverMail, otp) {
  try {
    //Create tranporter by whom mail is being sent
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASSWORD,
      },
    });

    const generateOTPEmail = (otp) => {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: #f5f7fa;
                    color: #333;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
                }
                
                .header {
                    background: linear-gradient(135deg, #6e8efb, #a777e3);
                    padding: 30px;
                    text-align: center;
                    color: white;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .header h1 svg {
                    margin-right: 10px;
                }
                
                .content {
                    padding: 30px;
                }
                
                .otp-container {
                    margin: 30px 0;
                    text-align: center;
                }
                
                .otp-code {
                    display: inline-block;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    padding: 20px 30px;
                    background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
                    border-radius: 10px;
                    color: #2d3748;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                
                .note {
                    background-color: #f8fafc;
                    padding: 15px;
                    border-left: 4px solid #6e8efb;
                    border-radius: 4px;
                    font-size: 14px;
                    margin: 25px 0;
                }
                
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 12px;
                    color: #718096;
                    border-top: 1px solid #edf2f7;
                }
                
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #6e8efb, #a777e3);
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    margin: 15px 0;
                }
                
                @media (max-width: 620px) {
                    .container {
                        margin: 0;
                        border-radius: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3.5V5.5M5.5 12H3.5M18.5 12H20.5M16.5 7.5L18 6M8 7.5L6.5 6M12 16.5L10.5 18M12 16.5L13.5 18M16.5 16.5L18 18M8 16.5L6.5 18M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Your Verification Code
                    </h1>
                </div>
                
                <div class="content">
                    <p>Hello there,</p>
                    <p>We received a request to verify your email address. Please use the following One-Time Password (OTP) to complete your verification:</p>
                    
                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <p>If you didn't request this code, you can safely ignore this email or contact our support team if you have any concerns.</p>
                  
                </div>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} HearBeat Pvt Ltd. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;
    };

    //Content of mail to the Reciever
    const mailOptions = {
      from: `no-reply@heartbeat.com`,
      to: recieverMail,
      subject: "Your One Time Password",
      html: generateOTPEmail(otp),
    };
    const res = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = sendOtp;
