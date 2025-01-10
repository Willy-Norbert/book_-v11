  // Remove spinner once the page fully loads
  window.addEventListener('load', () => {
    document.getElementById('loader-container').style.display = 'none';
    document.body.classList.remove('loading');
  });

  // Show spinner on link clicks
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('target');
      if (!target || target === '_self') {
        // Show spinner for same-tab navigation
        document.getElementById('loader-container').style.display = 'flex';
        document.body.classList.add('loading');
      }
    });
  });

  // JavaScript code to handle the click events and background change

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.link');

  links.forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          
          // Remove 'active' class from all links
          links.forEach(l => l.classList.remove('active'));

          // Add 'active' class to the clicked link
          link.classList.add('active');
      });
  });
});
  const contentData = {
    'content-about': `
      <div class="container-xl">
        <div class="row p-3 gap-3 text-center">
          <div class=" col-xl-4 col-sm-4 col-xs-12 bg-white shadow rounded"><h6 class="p-3">help people to know you <br></h6>
          <a href="" class="btn btn-danger rounded " >Add description</a>
          <p class="py-3"> <span class="fw-normal">joined</span> November 21,2023</P>
          <p>As you explore our website, you'll discover a curated collection of books that span genres and generations, each one a gateway to new worlds and ideas. Our passionate team is dedicated to bringing you the best in literature, from timeless classics to contemporary gems, ensuring there's something to captivate every reader's heart.</p>
          </div>
          <div class="col-xl-7 col-sm-7 bg-success p-2  bg-opacity-50  col-xs-12 background11  shadow rounded "> <div class="content"><h1 class="border border-white mb-5  text-white fw-normal text-center  align-middle ">Start reading</h1></div></div>
        </div>
      </div>`,
    'content-work': `
      <div class="container-xl">
        <div class="row p-3 gap-3">
          <div class="col-xl-4 col-sm-4 col-xs-12 bg-white shadow rounded">Content for Work: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit molestiae quaerat illo explicabo beatae asperiores ullam officiis cumque tenetur architecto! Corporis omnis eligendi tempore laboriosam, sint excepturi dolores numquam neque.</div>
          <div class="col-xl-7 col-sm-7 col-xs-12 bg-white shadow rounded">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab veniam incidunt ipsa. Soluta sed provident vel laborum itaque facilis quibusdam animi, possimus reiciendis voluptate nesciunt dolorem, quae, amet esse ad?</div>
        </div>
      </div>`,
    'content-readings': `
      <div class="container-xl">
        <div class="row p-3 gap-3">
          <div class="col-xl-4 col-sm-4 col-xs-12 bg-white shadow rounded">Content for Readings: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit molestiae quaerat illo explicabo beatae asperiores ullam officiis cumque tenetur architecto! Corporis omnis eligendi tempore laboriosam, sint excepturi dolores numquam neque.</div>
          <div class="col-xl-7 col-sm-7 col-xs-12 bg-white shadow rounded">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab veniam incidunt ipsa. Soluta sed provident vel laborum itaque facilis quibusdam animi, possimus reiciendis voluptate nesciunt dolorem, quae, amet esse ad?</div>
        </div>
      </div>`,
    'content-about2': `
      <div class="container-xl">
        <div class="row p-3 gap-3">
          <div class="col-xl-4 col-sm-4 col-xs-12 bg-white shadow rounded">Content for About 2: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit molestiae quaerat illo explicabo beatae asperiores ullam officiis cumque tenetur architecto! Corporis omnis eligendi tempore laboriosam, sint excepturi dolores numquam neque.</div>
          <div class="col-xl-7 col-sm-7 col-xs-12 bg-white shadow rounded">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab veniam incidunt ipsa. Soluta sed provident vel laborum itaque facilis quibusdam animi, possimus reiciendis voluptate nesciunt dolorem, quae, amet esse ad?</div>
        </div>
      </div>`
  };

  const col1Elements = document.querySelectorAll('.col1');
  const contentDisplay = document.getElementById('content-display');

  col1Elements.forEach(function(col) {
    col.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor click behavior
      const contentId = this.getAttribute('data-content-id');
      contentDisplay.innerHTML = contentData[contentId];
      contentDisplay.style.display = 'block';
    });
  });

  
    $(document).ready(function(){
        $('.carousel').slick({
            dots: true,
            infinite: true,
            speed: 600,
            slidesToShow: 3,
            slidesToScroll: 1,
             autoplay: true,
                       autoplaySpeed: 2000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow:  2,
                        slidesToScroll: 1,
                       autoplay: true,
                       autoplaySpeed: 2000,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });
    window.addEventListener('load', function() {
      document.body.classList.add('loaded');
  });
  (function() {
    const scrollContainer = document.querySelector('.scroll-container');
    let scrollHeight = scrollContainer.scrollHeight;

    function autoScroll() {
        scrollContainer.scrollBy(0, 0.5);
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollHeight) {
            scrollContainer.scrollTop = 0;
        }
        requestAnimationFrame(autoScroll);
    }

    autoScroll();
})();

// $(document).ready(function() {
//   var lastScrollTop = 0;
//   var delay = 200; // delay in milliseconds

//   $(window).scroll(function(event) {
//     var st = $(this).scrollTop();
//     if (st > lastScrollTop) {
//       // Scroll Down
//       $('.delayed-section').stop(true).slideUp(delay);
//     } else {
//       // Scroll Up
//       $('.delayed-section').stop(true).slideDown(delay);
//     }
//     lastScrollTop = st;
//   });
// });

