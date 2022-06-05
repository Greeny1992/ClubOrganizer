using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class Event : MongoDocument
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public bool Active { get; set; }
        public ICollection<User> AcceptUsers { get; set; } = new List<User>();
        public ICollection<User> CancelUsers { get; set; } = new List<User>();
    }
}
