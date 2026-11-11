    import WorkSample from './accomplishments/WorkSample';
import WhitePaper from './accomplishments/WhitePaper';
import Presentation from './accomplishments/Presentation';
import Patent from './accomplishments/Patent';
import Certification from './accomplishments/Certification';
import OnlineProfile from './accomplishments/OnlineProfile';

function Accomplishments() {
    return (
        <>
            <div id="accomplishments_bx" className="job-bx bg-white m-b30">
                <h5 className="m-b10 c_content_header">Accomplishments</h5>
                <div className="list-row">
                    <div className="list-line">
                        <OnlineProfile />
                        <WorkSample />
                        <WhitePaper />
                        <Presentation />
                        <Patent />
                        <Certification />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Accomplishments