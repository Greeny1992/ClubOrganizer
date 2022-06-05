using Context.UnitOfWork;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Context.DAL
{
    public class Authentication
    {
        MongoDBUnitOfWork uow = null;

        public Authentication(MongoDBUnitOfWork uow)
        {
            this.uow = uow;
        }

        const string mySecret = "asdv234234^&%&^%&^hjsdfb2%%%";
        const string myIssuer = "http://georgprassl.at";
        const string myAudience = "http://georgprassl.at";
        SymmetricSecurityKey mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));

        public async Task<AuthenticationInformation> Authenticate(User usr)
        {


            if (usr != null)
            {
                AuthenticationInformation info = new AuthenticationInformation();

                DateTime expires = DateTime.UtcNow.AddDays(7);

                info.ExpirationDate = Utilities.Converter.ConvertDateToUnixTimeStamp(expires);

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier,usr.ID.ToString()),
                        new Claim(ClaimTypes.GivenName,usr.Lastname + " " + usr.Firstname),
                         new Claim(ClaimTypes.WindowsAccountName,usr.UserName),
                        new Claim(ClaimTypes.Role,usr.Role.ToString()),
                    }),
                    Expires = expires,
                    Issuer = myIssuer,
                    Audience = myAudience,
                    SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                info.Token = tokenHandler.WriteToken(token);

                return info;
            }

            return null;
        }



        public async Task<bool> ValidateCurrentToken(string token)
        {


            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var val = tokenHandler.ValidateToken(token, ValidationParams, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public TokenValidationParameters ValidationParams
        {
            get
            {
                return new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey
                };
            }
        }

        public String GetEmailByToken(String token)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                String finaltoken = token;

                if (token.StartsWith("Bearer "))
                {
                    finaltoken = token.Replace("Bearer ", "");
                }

                var val = tokenHandler.ValidateToken(finaltoken, ValidationParams, out SecurityToken validatedToken);

                if (val.HasClaim(x => x.Type == ClaimTypes.WindowsAccountName))
                {
                    Claim claim = val.Claims.FirstOrDefault(x => x.Type == ClaimTypes.WindowsAccountName);

                    if (claim != null && !String.IsNullOrEmpty(claim.Value))
                    {
                        return claim.Value;
                    }
                }
            }
            catch
            {
                return null;
            }
            return null;
        }

        public string GetClaim(string token, string claimType)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            var stringClaimValue = securityToken.Claims.First(claim => claim.Type == claimType).Value;
            return stringClaimValue;
        }

    }
}
