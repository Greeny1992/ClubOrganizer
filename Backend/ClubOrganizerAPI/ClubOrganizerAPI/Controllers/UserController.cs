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
    public class GroupsModel
    {
        public List<string> groupIds { get; set; }
    }

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

        [HttpPatch("PatchUser")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> PatchUser([FromQuery][Required] String id, [Required][FromBody] User user)
        {
            User usr = await mongo.User.FindByIdAsync(id);


            if (usr != null)
            {
                User patch = await mongo.User.UpdateOneAsync(user);


                return patch;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpGet("ListUsers")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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

        [HttpPost("AddOrUpdateGroupsToUser")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> AddGroupsToUser([Required][FromBody]  GroupsModel groups, [Required][FromQuery] String userId)
        {


            User usr = await mongo.User.AddOrUpdateGroupsToUser(userId, groups.groupIds);


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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
