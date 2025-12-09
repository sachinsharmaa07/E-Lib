import { useParams } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper.jsx";

function BookDetails() {
  const { id } = useParams();

  return (
    <div className="page">
      <SectionWrapper>
        <h2>Book Details</h2>
        <p>Book ID: {id}</p>
        <p>Later you can load full data from backend using this ID.</p>
      </SectionWrapper>
    </div>
  );
}

export default BookDetails;
