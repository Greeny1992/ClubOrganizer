using Context.DAL;

namespace BackendAPI.ResponseModels
{
    public class LoginResponse
    {
        public User User { get; set; }

        public AuthenticationInformation AuthenticationInformation { get; set; }

    }
}
