using Context.DAL;

namespace ClubOrganizerAPI.ResponseModels
{
    public class LoginResponse
    {
        public User User { get; set; }

        public AuthenticationInformation AuthenticationInformation { get; set; }

    }
}
