using ClubOrganizerAPI.RequestModels;
using ClubOrganizerAPI.ResponseModels;
using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        Authentication auth = MonitoringFacade.Instance.Authentication;

        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginCredentials cred)
        {
            User usr = await mongo.User.Login(cred.Username, cred.Password);
            AuthenticationInformation token = await auth.Authenticate(usr);

            if (token != null)
            {
                LoginResponse returnmodel = new LoginResponse();
                returnmodel.User = usr;
                returnmodel.AuthenticationInformation = token;
                return returnmodel;
            }

            return Unauthorized();
        }


        [HttpPost("CreateUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> CreateUser([Required][FromBody] User cred)
        {


            User usr = await mongo.User.InsertOrUpdateOneAsync(cred);


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpGet("ListUsers")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<User>>> ListUsers()
        {


            List<User> usr = mongo.User.FilterBy(x => true).ToList();


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpGet("GetUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> GetUser([Required][FromQuery] String id)
        {


            User usr = await mongo.User.FindByIdAsync(id);


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpPost("AddGroupToUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> AddGroupToUser([Required][FromQuery] String groupId, [Required][FromQuery] String userId)
        {


            User usr = await mongo.User.AddGroupToUser(userId, groupId);


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("GetClubsFromUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<Club>>> GetClubsFromUser()
        {
            User usr = null;
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if(userId != null)
            {
                usr = await mongo.User.FindByIdAsync(userId);
            }

            


            if (usr != null)
            {
                List<string> myClubs = (List<string>)usr.MyClubs;
                List<Club> returnClubs = new List<Club>();
                if (myClubs.Count() > 0)
                {
                    
                    myClubs.ForEach(async (club) =>
                    {
                        returnClubs.Add(await mongo.Club.FindByIdAsync(club));
                    });
                }


                return returnClubs;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("GetOwnedClub")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Club>> GetOwnedClub()
        {
            User usr = null;
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
            {
                usr = await mongo.User.FindByIdAsync(userId);
            }




            if (usr != null)
            {
                string ownedClubID = usr.OwnedClub;
                if (ownedClubID != null)
                {
                    return await mongo.Club.FindByIdAsync(ownedClubID);
                }

                return NotFound();


                 
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("GetUserByEmail")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> GetUserByEmail([Required][FromQuery] String email)
        {


            User usr = await mongo.User.FindOneAsync(x => x.Email == email);


            if (usr != null)
            {
                return usr;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("ListMemberFromClub")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<User>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<User>>> ListMemberFromClub([Required][FromQuery] String clubId)
        {


            List<User> members = await mongo.User.ListMemberFromClub(clubId);


            if (members != null)
            {


                return members;
            }
            else
            {
                return NoContent();
            }
        }
    }
}
