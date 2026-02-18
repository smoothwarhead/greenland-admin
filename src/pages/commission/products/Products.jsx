import { FaPlus } from "react-icons/fa6";
import { ButtonWithLefttIcon } from "../../../components/ui/buttons/Buttons";
import { useData } from "../../../context/DataContext";
import { ProductCard } from "../../../components/ui/product/ProductCard";
import "./products.scss";
import { filtersAndSort } from "../../../data/others";
import FiltersAndSortBar from "../../../components/ui/filters/filter-sort-bar/FilterAndSortBar";
import { useCommissionProductQuery } from "../../../hooks/useCommissionProductQuery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





const Products = () => {

  const navigate = useNavigate();

  const { commissionState } = useData();

  // ✅ DataContext-driven results (filtered + sorted)
  const { status, error, results } = useCommissionProductQuery();
  const [visible, setVisible] = useState([]);
  // console.log(commissionState);

  return (
    <div className="page">
      <div className="pageHeader">
        <div className="headerActions">
          <ButtonWithLefttIcon
            icon={<FaPlus />}
            text="Create Product"
            action={() => navigate("/app/commission/products/create-new")}
            variant="primary"
          />
        </div>
      </div>

      <div className="page-body">
        <div className="prdts-actions">
          {/* ✅ No products prop anymore; bar reads from DataContext via hook */}
          <FiltersAndSortBar groups={filtersAndSort} onResults={setVisible}/>
        </div>

        <div className="prdts-con">
          {commissionState?.status === "loading" && <p>Loading...</p>}

          {commissionState?.status === "error" && (
            <p style={{ color: "crimson" }}>{commissionState?.error || error}</p>
          )}

          {status === "ready" &&
            (visible?.length ? (
              visible.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={() => navigate(`/app/commission/products/${product.id}/edit`)} />
              ))
            ) : (
              <p>No products match your filters.</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
